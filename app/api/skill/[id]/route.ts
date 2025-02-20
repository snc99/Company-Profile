import { UpdateSkillSchema } from "@/lib/validation/skillSchema";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedSkill = await prisma.skill.delete({
      where: { id },
      select: { photo: true },
    });

    if (deletedSkill.photo) {
      const publicId = deletedSkill.photo.split("/").pop()?.split(".")[0];

      if (publicId) {
        cloudinary.uploader
          .destroy(`skills/${publicId}`)
          .catch((err) =>
            console.error("Error deleting from Cloudinary:", err)
          );
      }
    }

    return NextResponse.json(
      { message: "Skill deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ errors: ["Invalid ID"] }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const photoFile = formData.get("photo") as File | null;

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

    let uploadPromise: Promise<{ secure_url: string }> | null = null;
    if (photoFile && photoFile instanceof File) {
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      uploadPromise = new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "skills" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string });
          }
        );
        uploadStream.end(buffer);
      });
    }

    const [uploadResponse] = await Promise.all([
      uploadPromise,
      prisma.skill.update({
        where: { id },
        data: updateData,
      }),
    ]);

    if (uploadResponse?.secure_url) {
      await prisma.skill.update({
        where: { id },
        data: { photo: uploadResponse.secure_url },
      });
    }

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
