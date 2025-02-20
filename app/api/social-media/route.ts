import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { CreateSocialMediaSchema } from "@/lib/validation/sosmed";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const platform = formData.get("platform");
    const url = formData.get("url");
    const photoFile = formData.get("photo");

    const validation = CreateSocialMediaSchema.safeParse({
      platform,
      url,
      photo: photoFile,
    });

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.errors.map((err) => err.message) },
        { status: 400 }
      );
    }

    const arrayBuffer = await (photoFile as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = (await new Promise<unknown>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "social-media-photos",
          access_mode: "public",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    })) as { secure_url: string };

    const newSocialMedia = await prisma.socialMedia.create({
      data: {
        platform: platform as string,
        url: url as string,
        photo: uploadResponse.secure_url,
      },
    });

    return NextResponse.json(newSocialMedia, { status: 201 });
  } catch (error) {
    console.error("Error uploading social media photo:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const socialMediaData = await prisma.socialMedia.findMany();
    return NextResponse.json(socialMediaData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: "Unknown error" }, { status: 500 });
    }
  }
}
