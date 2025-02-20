import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { LRUCache } from "lru-cache";
import { CreatePersonalInfoSchema } from "@/lib/validation/personalInfo";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// **1. Setup Rate Limiting Cache**
const rateLimitCache = new LRUCache<string, number>({
  max: 100,
  ttl: 60000,
});

// **2. Helper function untuk sanitasi nama file**
function sanitizeFileName(originalName: string) {
  return originalName
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Ganti karakter aneh dengan "_"
    .slice(-50); // Ambil hanya 50 karakter terakhir agar tidak terlalu panjang
}

// **3. Fungsi utama untuk menangani request POST**
export async function POST(request: Request) {
  // **4. Rate Limiting (Cek apakah user spam request)**
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
    // **5. Ambil data dari request**
    const formData = await request.formData();
    const motto = formData.get("motto") as string;
    const cvFile = formData.get("cv") as File;

    // **6. Validasi input dengan Zod**
    const result = CreatePersonalInfoSchema.safeParse({ motto, cv: cvFile });

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    // **7. Cek apakah motto yang baru sama dengan yang lama**
    const existingData = await prisma.home.findFirst();
    if (existingData && existingData.motto === motto) {
      return NextResponse.json(
        { message: "Motto baru tidak boleh sama dengan yang lama." },
        { status: 409 }
      );
    }

    // **8. Upload file ke Cloudinary dengan nama yang disanitasi**
    const sanitizedFileName = sanitizeFileName(cvFile.name);
    const arrayBuffer = await cvFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = (await new Promise<unknown>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "cv_files",
          public_id: sanitizedFileName,
          access_mode: "public",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    })) as { secure_url: string };

    // **9. Simpan ke database**
    if (existingData) {
      // Data sudah ada, lakukan update
      await prisma.home.update({
        where: { id: existingData.id }, // Gunakan ID yang valid untuk update
        data: { motto, cvLink: uploadResponse.secure_url },
      });
    } else {
      // Data belum ada, buat data baru
      await prisma.home.create({
        data: { motto, cvLink: uploadResponse.secure_url },
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
