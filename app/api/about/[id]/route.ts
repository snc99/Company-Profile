import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AboutSchema } from "@/lib/validation/about";

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

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const requestData = await req.json();

    const parsedData = AboutSchema.safeParse(requestData);

    if (!parsedData.success) {
      return NextResponse.json(
        { message: parsedData.error.errors[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { description: about } = parsedData.data;

    const existingAbout = await prisma.about.findUnique({ where: { id } });

    if (!existingAbout) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update data di database
    const updatedAbout = await prisma.about.update({
      where: { id },
      data: { description: about },
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { about } = body;

    const parsedData = AboutSchema.safeParse({ description: about });

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
