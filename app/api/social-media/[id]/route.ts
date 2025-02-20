import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { UpdateSocialMediaSchema } from "@/lib/validation/sosmed";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ errors: ["Invalid ID"] }, { status: 400 });
    }

    const formData = await req.formData();
    const platform = formData.get("platform") as string | null;
    const url = formData.get("url") as string | null;
    const photoFile = formData.get("photo") as File | null;

    const validationResult = UpdateSocialMediaSchema.safeParse({
      platform,
      url,
      photo: photoFile,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          errors: validationResult.error.errors.map((err) => err.message),
        },
        { status: 400 }
      );
    }

    const updateData: Record<string, string> = {};

    if (platform !== null && platform !== undefined)
      updateData.platform = platform;
    if (url !== null && url !== undefined) updateData.url = url;

    if (photoFile && photoFile instanceof File) {
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        const uploadResponse = (await new Promise<unknown>(
          (resolve, reject) => {
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
          }
        )) as { secure_url: string };

        updateData.photo = uploadResponse.secure_url;
      } catch (error) {
        console.error("Error uploading photo to Cloudinary:", error);
        return NextResponse.json(
          { errors: ["Gagal mengupload foto"] },
          { status: 500 }
        );
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { errors: ["Tidak ada perubahan data"] },
        { status: 400 }
      );
    }

    const updatedSocialMedia = await prisma.socialMedia.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedSocialMedia, { status: 200 });
  } catch (error) {
    console.error("Error updating social media data:", error);
    return NextResponse.json(
      { errors: ["Gagal mengupdate data", (error as Error).message] },
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
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const socialMediaData = await prisma.socialMedia.findUnique({
      where: { id },
    });

    if (!socialMediaData) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(socialMediaData, { status: 200 });
  } catch (error) {
    console.error("Error fetching social media data:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ errors: ["Invalid ID"] }, { status: 400 });
    }

    const existingData = await prisma.socialMedia.findUnique({
      where: { id },
      select: { photo: true },
    });

    if (!existingData) {
      return NextResponse.json(
        { errors: ["Data tidak ditemukan"] },
        { status: 404 }
      );
    }

    if (existingData.photo) {
      const urlParts = existingData.photo.split("/");
      const filenameWithExtension = urlParts[urlParts.length - 1];
      const publicId = filenameWithExtension.split(".")[0];

      if (publicId) {
        await cloudinary.uploader.destroy(`social-media-photos/${publicId}`);
      }
    }

    const deletedSocialMedia = await prisma.socialMedia.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Social media entry deleted successfully",
        data: deletedSocialMedia,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { errors: ["Gagal menghapus data", (error as Error).message] },
      { status: 500 }
    );
  }
}
