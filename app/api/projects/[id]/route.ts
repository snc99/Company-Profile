import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { CreateProjectSchema } from "@/lib/validation/project";

// GET: Ambil semua proyek
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        techStack: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Cek apakah project ada
    const project = await prisma.project.findUnique({
      where: { id },
      select: { projectImage: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Hapus data dari database terlebih dahulu
    await prisma.project.delete({ where: { id } });

    // Jika ada gambar, hapus dari Cloudinary
    if (project.projectImage && project.projectImage.startsWith("http")) {
      try {
        await deleteFromCloudinary(project.projectImage);
      } catch (cloudinaryError) {
        console.error("❌ Cloudinary Delete Error:", cloudinaryError);
      }
    }

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const link = formData.get("link") as string;
    const skills = JSON.parse(formData.get("skills") as string) as string[];
    const projectImage = formData.get("projectImage") as File | null;
    const existingImage = formData.get("existingImage") as string | null;

    const validationResult = CreateProjectSchema.safeParse({
      title,
      description,
      link,
      projectImage: projectImage ?? null,
      skills,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors.map((err) => err.message) },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json(
        { error: "Proyek tidak ditemukan" },
        { status: 404 }
      );
    }

    let uploadedImageUrl = existingImage;

    if (projectImage) {
      uploadedImageUrl = await uploadToCloudinary(projectImage, "projects");

      if (project.projectImage) {
        await deleteFromCloudinary(project.projectImage);
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        link,
        projectImage: uploadedImageUrl,
        techStack: {
          deleteMany: {},
          create: skills.map((skillId) => ({
            skill: { connect: { id: skillId } },
          })),
        },
      },
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui proyek" },
      { status: 500 }
    );
  }
}
