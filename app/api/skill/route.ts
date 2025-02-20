import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { CreateSkillSchema } from "@/lib/validation/skillSchema";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

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

    let uploadResponse;
    try {
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      uploadResponse = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "skills", access_mode: "public" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { secure_url: string });
            }
          );
          uploadStream.end(buffer);
        }
      );

      if (!uploadResponse?.secure_url) {
        return NextResponse.json(
          { error: "Upload failed, secure_url not found" },
          { status: 500 }
        );
      }
    } catch (uploadError) {
      console.error("❌ Cloudinary Upload Error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload photo" },
        { status: 500 }
      );
    }

    const newSkill = await prisma.skill.create({
      data: {
        name,
        photo: uploadResponse.secure_url,
      },
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
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
