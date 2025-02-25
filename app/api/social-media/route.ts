import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateSocialMediaSchema } from "@/lib/validation/sosmed";
import { uploadToCloudinary } from "@/lib/cloudinary";

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

    const uploadedUrl = await uploadToCloudinary(photoFile as File, "social-media-photos");

    const newSocialMedia = await prisma.socialMedia.create({
      data: {
        platform: platform as string,
        url: url as string,
        photo: uploadedUrl,
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
