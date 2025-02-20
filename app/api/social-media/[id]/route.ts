import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateSocialMediaSchema } from "@/lib/validation/sosmed";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

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
        { errors: validationResult.error.errors.map((err) => err.message) },
        { status: 400 }
      );
    }

    const updateData: Record<string, string | undefined> = {}; // ✅ Perbaikan tipe

    if (platform) updateData.platform = platform;
    if (url) updateData.url = url;

    // Jika ada file baru, hapus file lama dan upload yang baru
    if (photoFile) {
      const existingData = await prisma.socialMedia.findUnique({
        where: { id },
        select: { photo: true },
      });

      if (existingData?.photo) {
        await deleteFromCloudinary(existingData.photo); // ✅ Hanya satu parameter
      }

      const uploadedUrl = await uploadToCloudinary(
        photoFile,
        "social-media-photos"
      );

      if (typeof uploadedUrl === "string") {
        updateData.photo = uploadedUrl; // ✅ Hanya masukkan jika tipe string
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
      await deleteFromCloudinary(existingData.photo);
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
