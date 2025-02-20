import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { UpdatePersonalInfoSchema } from "@/lib/validation/personalInfo";

function sanitizeFileName(originalName: string) {
  const sanitized = originalName.replace(/[^a-zA-Z0-9.-]/g, "_").slice(-50);
  const extension = ".pdf";

  if (sanitized.toLowerCase().endsWith(extension)) {
    return sanitized;
  }

  return sanitized + extension;
}

async function uploadToCloudinary(file: File) {
  const sanitizedFileName = sanitizeFileName(file.name);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "cv_files",
        public_id: sanitizedFileName,
        access_mode: "public",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

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

    if (existingData.motto.trim() === motto.trim()) {
      return NextResponse.json(
        { message: "Motto tidak berubah" },
        { status: 200 }
      );
    }

    let cvUrl: string | undefined;
    if (cvFile) {
      cvUrl = (await uploadToCloudinary(cvFile)) as string;
    }

    const updatedHome = await prisma.home.update({
      where: { id },
      data: {
        motto,
        cvLink: cvUrl || existingData.cvLink,
      },
    });

    return NextResponse.json(updatedHome, { status: 200 });
  } catch (error) {
    console.error("Error updating home data:", error);
    return NextResponse.json(
      { message: "Gagal ", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const existingData = await prisma.home.findUnique({
      where: { id },
    });

    if (!existingData) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

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
