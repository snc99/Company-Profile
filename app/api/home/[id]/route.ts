import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cek variabel lingkungan Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

if (
  !cloudinaryConfig.cloud_name ||
  !cloudinaryConfig.api_key ||
  !cloudinaryConfig.api_secret
) {
  console.error(
    "Cloudinary environment variables are missing:",
    cloudinaryConfig
  );
  throw new Error("Cloudinary environment variables are missing");
}

cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret,
});

// Fungsi untuk menangani PUT request
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    // Memastikan params sudah siap sebelum mengaksesnya
    const { params } = context;
    const { id } = await params; // Menunggu akses ke params.id

    // Memeriksa apakah ID valid
    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const motto = formData.get("motto") as string;
    const cvFile = formData.get("cv") as File | null;

    let cvUrl: string | undefined = undefined;

    if (cvFile) {
      // Pastikan upload file berjalan lancar
      cvUrl = await uploadToCloudinary(cvFile);
    }

    const updatedHome = await prisma.home.update({
      where: { id: id },
      data: { motto, cvLink: cvUrl || undefined },
    });

    return NextResponse.json(updatedHome, { status: 200 });
  } catch (error) {
    console.error("Error updating home data:", error);
    return NextResponse.json(
      { message: "Gagal mengupdate data", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Fungsi upload ke Cloudinary
async function uploadToCloudinary(file: File): Promise<string | undefined> {
  // Cek apakah file ada
  if (!file) {
    throw new Error("Tidak ada file yang dipilih");
  }

  // Cek ukuran file (misalnya 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran file terlalu besar. Maksimal 5MB.");
  }

  // Cek format file jika perlu (misalnya hanya PDF)
  if (!["application/pdf"].includes(file.type)) {
    throw new Error(
      "Format file tidak didukung. Hanya PDF yang diperbolehkan."
    );
  }

  // Mengonversi file menjadi buffer untuk di-upload
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Melakukan upload ke Cloudinary
  const uploadResponse = (await new Promise<unknown>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // PDF di-upload sebagai raw file agar tidak dikonversi
        folder: "cv-files", // Tentukan folder penyimpanan di Cloudinary
        access_mode: "public", // Publik agar dapat diakses dengan URL
        format: "pdf", // Memastikan file tetap dalam format PDF
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  })) as { secure_url: string };

  return (uploadResponse as { secure_url: string }).secure_url; // Mengambil URL file yang di-upload
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params to resolve dynamic routing
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    // Menghapus data berdasarkan id yang diberikan
    const homeData = await prisma.home.delete({
      where: {
        id: id, // Menggunakan id yang sudah terambil
      },
    });

    return NextResponse.json(homeData, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting data:", error.message);
      return NextResponse.json(
        { message: "Gagal menghapus data", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("An unknown error occurred:", error);
      return NextResponse.json(
        { message: "Gagal menghapus data", error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Tambahkan await di sini

    console.log("Params diterima:", id); // Pastikan ID sudah diterima dengan benar

    if (!id) {
      console.error("ID tidak ditemukan pada params.");
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const homeData = await prisma.home.findUnique({
      where: { id },
    });

    if (!homeData) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(homeData);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
