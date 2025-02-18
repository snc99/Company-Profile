import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const aboutSchema = z.object({
  description: z
    .string()
    .min(3, "Deskripsi harus memiliki minimal 3 karakter.")
    .max(1000, "Deskripsi terlalu panjang, maksimal 1000 karakter.")
    .nonempty("Deskripsi tidak boleh kosong."),
});

// memperbaiki GET by ID

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const aboutData = await prisma.about.findUnique({
      where: { id },
    });

    if (!aboutData) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(aboutData);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { about } = await req.json();

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

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const { description } = await req.json();

    const parsedData = aboutSchema.safeParse({ description });

    if (!parsedData.success) {
      return NextResponse.json(
        { message: parsedData.error.errors[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const updatedAbout = await prisma.about.update({
      where: { id },
      data: { description },
    });

    return NextResponse.json(updatedAbout, { status: 200 });
  } catch (error) {
    console.error("Error updating about:", error);
    return NextResponse.json(
      { message: "Failed to update about" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const deletedAbout = await prisma.about.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Data berhasil dihapus",
      data: deletedAbout,
    });
  } catch (error) {
    console.error("Error saat menghapus data:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data" },
      { status: 500 }
    );
  }
}
