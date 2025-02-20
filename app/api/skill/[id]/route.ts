import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { UpdateSkillSchema } from "@/lib/validation/skillSchema";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Cek apakah data skill ada
    const skill = await prisma.skill.findUnique({
      where: { id },
      select: { photo: true },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Hapus data dari database terlebih dahulu
    await prisma.skill.delete({ where: { id } });

    // Jika ada foto, hapus dari Cloudinary
    if (skill.photo && skill.photo.startsWith("http")) {
      try {
        await deleteFromCloudinary(skill.photo);
      } catch (cloudinaryError) {
        console.error("❌ Cloudinary Delete Error:", cloudinaryError);
      }
    }

    return NextResponse.json(
      { message: "Skill deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting skill:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ errors: ["Invalid ID"] }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get("name")?.toString().trim();
    const photoFile = formData.get("photo");

    const validation = await UpdateSkillSchema.safeParseAsync({
      name,
      photo: photoFile,
    });
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.errors.map((err) => err.message) },
        { status: 400 }
      );
    }

    const updateData: Record<string, string> = {};
    if (name) updateData.name = name;

    if (photoFile && photoFile instanceof File) {
      try {
        const uploadedUrl = await uploadToCloudinary(photoFile, "skills");
        updateData.photo = uploadedUrl;
      } catch (uploadError) {
        console.error("❌ Cloudinary Upload Error:", uploadError);
        return NextResponse.json(
          { errors: ["Failed to upload photo"] },
          { status: 500 }
        );
      }
    }

    await prisma.skill.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Skill updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating skill:", error);
    return NextResponse.json(
      { errors: ["Gagal mengupdate skill", (error as Error).message] },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak boleh kosong" },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      return NextResponse.json(
        { error: "Skill tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error saat mengambil skill:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data skill" },
      { status: 500 }
    );
  }
}
