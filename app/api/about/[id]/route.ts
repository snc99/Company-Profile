import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const aboutSchema = z.object({
  description: z
    .string()
    .min(3, "Deskripsi harus memiliki minimal 3 karakter.")
    .max(1000, "Deskripsi terlalu panjang, maksimal 1000 karakter.")
    .nonempty("Deskripsi tidak boleh kosong."),
});

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const aboutData = await prisma.about.findUnique({
      where: { id },
    });

    if (!aboutData) {
      return NextResponse.json({ message: "About not found" }, { status: 404 });
    }

    return NextResponse.json(aboutData, { status: 200 });
  } catch (error) {
    console.error("Error fetching about:", error);
    return NextResponse.json(
      { message: "Failed to fetch about data" },
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
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const { description } = await req.json();

  const parsedData = aboutSchema.safeParse({ description });

  if (!parsedData.success) {
    return NextResponse.json(
      { message: parsedData.error.errors[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }

  try {
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
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
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
