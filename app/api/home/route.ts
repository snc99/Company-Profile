import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const HomeSchema = z.object({
  motto: z
    .string()
    .min(3, "Motto minimal 3 karakter")
    .max(100, "Motto maksimal 100 karakter")
    .refine((value) => value.trim() !== "", {
      message: "Motto wajib diisi",
    }),

  cv: z
    .instanceof(File)
    .refine((file) => file !== null && file !== undefined, {
      message: "File CV wajib diisi",
    })
    .refine((file) => file.type === "application/pdf", {
      message: "File harus berupa PDF",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File tidak boleh lebih dari 10MB",
    }),
});

export async function POST(request: Request) {
  try {
    // Ambil formData dari request
    const formData = await request.formData();
    const cvFile = formData.get("cv");

    // Cek apakah cvFile adalah instance dari File
    if (!(cvFile instanceof File)) {
      return NextResponse.json(
        { message: "Input tidak berupa file yang valid." },
        { status: 400 }
      );
    }

    const motto = formData.get("motto") as string;

    // Validasi menggunakan Zod
    const result = HomeSchema.safeParse({ motto, cv: cvFile });

    if (!result.success) {
      // Menampilkan pesan error dari Zod jika validasi gagal
      return NextResponse.json(
        {
          errors: result.error.errors.map((e) => ({
            message: e.message,
            field: e.path[0],
          })),
        },
        { status: 400 }
      );
    }

    // Proses upload jika validasi berhasil
    const arrayBuffer = await cvFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file ke Cloudinary
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

    // Cek apakah data sudah ada
    const existingData = await prisma.home.findFirst({
      where: { motto: { not: "" } },
    });

    if (existingData) {
      return NextResponse.json(
        { message: "Data sudah ada. Anda tidak bisa menambahkan data baru." },
        { status: 409 }
      );
    }

    // Simpan data ke database
    const newHomeData = await prisma.home.create({
      data: {
        motto: motto,
        cvLink: uploadResponse.secure_url,
      },
    });

    // Mengembalikan response sukses
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
    const homeData = await prisma.home.findFirst();

    if (!homeData) {
      return NextResponse.json(
        { motto: null, cvLink: null }, // Pastikan NULL, bukan string
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        id: homeData.id, // Pastikan id disertakan di sini
        motto: homeData.motto || null,
        cvLink: homeData.cvLink || null,
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
