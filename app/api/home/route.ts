import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma"; // Import Prisma Client

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const cvFile = formData.get("cv") as File;
    const motto = formData.get("motto") as string; // Ambil motto dari form

    // Pengecekan apakah data sudah ada berdasarkan motto yang sudah ada
    const existingData = await prisma.home.findFirst({
      where: { motto: { not: "" } }, // Mengecek apakah ada motto yang tidak kosong
    });

    if (existingData) {
      return NextResponse.json(
        { message: "Data sudah ada. Anda tidak bisa menambahkan motto baru." },
        { status: 409 } // 409 Conflict - Data sudah ada
      );
    }

    if (!cvFile) {
      return NextResponse.json(
        { message: "File is required" },
        { status: 400 }
      );
    }

    // Konversi File ke Buffer
    const arrayBuffer = await cvFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload ke Cloudinary
    const uploadResponse = (await new Promise<unknown>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "uploads", access_mode: "public" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    })) as { secure_url: string };

    console.log("Cloudinary Upload Response:", uploadResponse);

    // Simpan Data ke Database
    const newHomeData = await prisma.home.create({
      data: {
        motto: motto || "Default Motto",
        cvLink: uploadResponse.secure_url, // URL dari Cloudinary
      },
    });

    console.log("Data berhasil disimpan ke database:", newHomeData);

    return NextResponse.json(newHomeData, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Ambil data dari tabel 'Home'
    const homeData = await prisma.home.findFirst(); // Mengambil data pertama (hanya 1 data Home)

    if (!homeData) {
      return NextResponse.json(
        { message: "No home data found" },
        { status: 404 }
      );
    }

    // Mengembalikan data motto dan cvLink
    return NextResponse.json(homeData, { status: 200 });
  } catch (error) {
    console.error("Error fetching home data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
