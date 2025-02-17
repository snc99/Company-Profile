import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const platform = formData.get("platform") as string;
    const url = formData.get("url") as string;
    const photoFile = formData.get("photo") as File;

    if (!platform || !url || !photoFile) {
      return NextResponse.json(
        { message: "Platform, URL, and Photo are required" },
        { status: 400 }
      );
    }

    // Convert the file to buffer for upload
    const arrayBuffer = await photoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload photo to Cloudinary
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

    // Store the social media data to Prisma
    const newSocialMedia = await prisma.socialMedia.create({
      data: {
        platform,
        url,
        photo: uploadResponse.secure_url, // Cloudinary URL
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
    const socialMediaData = await prisma.socialMedia.findMany(); // Sesuaikan dengan model Anda
    return NextResponse.json(socialMediaData);
  } catch (error: unknown) {
    // Type assertion to Error
    if (error instanceof Error) {
      console.error(error.message); // You can log the error message here
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: "Unknown error" }, { status: 500 });
    }
  }
}
