import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const aboutSchema = z.object({
  about: z
    .string()
    .nonempty("Deskripsi tidak boleh kosong.")
    .min(3, "Deskripsi harus memiliki minimal 3 karakter.")
    .max(1000, "Deskripsi terlalu panjang, maksimal 1000 karakter."),
});

export async function POST(req: Request) {
  try {
    const { about } = await req.json();
    const parsedData = aboutSchema.safeParse({ about });

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.errors.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const existingAbout = await prisma.about.findFirst();
    if (existingAbout) {
      return NextResponse.json(
        { error: "Data About sudah ada, tidak bisa menambahkan lagi." },
        { status: 400 }
      );
    }

    const newAbout = await prisma.about.create({
      data: {
        description: about,
      },
    });

    return NextResponse.json(newAbout, { status: 201 });
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data About." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const aboutData = await prisma.about.findFirst();

    // Periksa apakah ada data dan kembalikan id bersama description
    return NextResponse.json(
      aboutData
        ? { id: aboutData.id, description: aboutData.description } // Sertakan id di sini
        : { description: null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data About." },
      { status: 500 }
    );
  }
}
