import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { UpdatePersonalInfoSchema } from "@/lib/validation/personalInfo";
import { deleteFromCloudinary, updateCloudinaryFile } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const existingData = await prisma.home.findUnique({ where: { id } });
    if (!existingData) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const motto = formData.get("motto") as string;
    const cvFile = formData.get("cv") as File | null;

    const result = UpdatePersonalInfoSchema.safeParse({ motto, cv: cvFile });
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    if (existingData.motto.trim() === motto.trim() && !cvFile) {
      return NextResponse.json(
        { message: "Tidak ada perubahan" },
        { status: 200 }
      );
    }

    let cvUrl = existingData.cvLink;
    if (cvFile) {
      cvUrl = await updateCloudinaryFile(
        existingData.cvLink ?? "",
        cvFile,
        "cv_files"
      ); // ✅ Perbaikan di sini
    }

    const updatedHome = await prisma.home.update({
      where: { id },
      data: {
        motto,
        cvLink: cvUrl,
      },
    });

    return NextResponse.json(updatedHome, { status: 200 });
  } catch (error) {
    console.error("Error updating home data:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui data", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params dibuat sebagai Promise
) {
  try {
    const { id } = await context.params; // ✅ Tunggu Promise params selesai

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    // Cari data sebelum dihapus
    const existingData = await prisma.home.findUnique({
      where: { id },
      select: { cvLink: true },
    });

    if (!existingData) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika ada file di Cloudinary, hapus terlebih dahulu
    if (existingData.cvLink) {
      await deleteFromCloudinary(existingData.cvLink);
    }

    // Hapus data dari database
    await prisma.home.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Data berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { message: "Gagal menghapus data", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const personalInfo = await prisma.home.findUnique({
      where: { id },
    });

    if (!personalInfo) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(personalInfo, { status: 200 });
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: (error as Error).message },
      { status: 500 }
    );
  }
}
