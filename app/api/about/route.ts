import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AboutSchema } from "@/lib/validation/about";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description } = body;

    const parsedData = AboutSchema.safeParse({ description });

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
        description: parsedData.data.description,
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

    return NextResponse.json(
      aboutData
        ? { id: aboutData.id, description: aboutData.description }
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
