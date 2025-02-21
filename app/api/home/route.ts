import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LRUCache } from "lru-cache";
import { CreatePersonalInfoSchema } from "@/lib/validation/personalInfo";
import { uploadToCloudinary } from "@/lib/cloudinary";

// **1. Setup Rate Limiting Cache**
const rateLimitCache = new LRUCache<string, number>({
  max: 100,
  ttl: 60000,
});

// **2. Fungsi utama untuk menangani request POST**

export async function POST(request: Request) {
  // **3. Rate Limiting (Cek apakah user spam request)**
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const requestCount = rateLimitCache.get(ip) || 0;

  if (requestCount >= 5) {
    return NextResponse.json(
      { message: "Terlalu banyak request, coba lagi nanti." },
      { status: 429 }
    );
  }

  rateLimitCache.set(ip, requestCount + 1);

  try {
    // **4. Ambil data dari request**
    const formData = await request.formData();
    const motto = formData.get("motto") as string;
    const cvFile = formData.get("cv") as File;

    // **5. Validasi input dengan Zod**
    const result = CreatePersonalInfoSchema.safeParse({ motto, cv: cvFile });

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    // **6. Cek apakah motto yang baru sama dengan yang lama**
    const existingData = await prisma.home.findFirst();
    if (existingData && existingData.motto === motto) {
      return NextResponse.json(
        { message: "Motto baru tidak boleh sama dengan yang lama." },
        { status: 409 }
      );
    }

    // **7. Upload file ke Cloudinary**
    const uploadedUrl = await uploadToCloudinary(cvFile, "cv_files");
    const originalName = cvFile.name;  // Nama asli file

    // **8. Simpan ke database**
    if (existingData) {
      // Data sudah ada, lakukan update
      await prisma.home.update({
        where: { id: existingData.id }, // Gunakan ID yang valid untuk update
        data: { motto, cvLink: uploadedUrl, cvFilename: originalName },
      });
    } else {
      // Data belum ada, buat data baru
      await prisma.home.create({
        data: { motto, cvLink: uploadedUrl, cvFilename: originalName },
      });
    }

    return NextResponse.json(
      { message: "Data berhasil disimpan." },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan, coba lagi nanti." },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const personalInfo = await prisma.home.findFirst();

    if (!personalInfo) {
      return NextResponse.json({ motto: null, cvLink: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        id: personalInfo.id,
        motto: personalInfo.motto || null,
        cvLink: personalInfo.cvLink || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching home data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
