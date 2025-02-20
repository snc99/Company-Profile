import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateSkillSchema } from "@/lib/validation/skillSchema";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim();
    const photoFile = formData.get("photo");

    if (!name || !photoFile || !(photoFile instanceof File)) {
      return NextResponse.json(
        { error: "Name and a valid photo are required" },
        { status: 400 }
      );
    }

    const validation = CreateSkillSchema.safeParse({ name, photo: photoFile });
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Upload foto ke Cloudinary
    let uploadedUrl;
    try {
      uploadedUrl = await uploadToCloudinary(photoFile, "skills");
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload photo" },
        { status: 500 }
      );
    }

    // Simpan data ke database
    const newSkill = await prisma.skill.create({
      data: {
        name,
        photo: uploadedUrl,
      },
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const skills = await prisma.skill.findMany();
    return NextResponse.json(skills, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ Error fetching skills:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
