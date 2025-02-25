import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { CreateProjectSchema } from "@/lib/validation/project";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); 

    if (id) {
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
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(project, { status: 200 });
    }

    const projects = await prisma.project.findMany({
      include: {
        techStack: {
          include: {
            skill: true, 
          },
        },
      },
    });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = (formData.get("description") as string | null) || "";
    const link = (formData.get("link") as string | null) || "";
    const projectImageFile = formData.get("projectImage") as File | null;
    const techstack = formData.get("skills") as string | null; 

    let skillsArray: string[] = [];
    if (techstack) {
      try {
        skillsArray = JSON.parse(techstack);
        if (!Array.isArray(skillsArray)) {
          throw new Error("Skills harus berupa array.");
        }
      } catch (err) {
        console.error("Error parsing skills:", err);
        return NextResponse.json(
          { error: { skills: "Format skills tidak valid." } },
          { status: 400 }
        );
      }
    }

    const validationResult = CreateProjectSchema.safeParse({
      title,
      description,
      link,
      projectImage: projectImageFile,
      skills: skillsArray, 
    });

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.errors.reduce(
        (acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        },
        {} as Record<string, string>
      );

      return NextResponse.json({ error: formattedErrors }, { status: 400 });
    }

    const projectImageUrl = projectImageFile
      ? await uploadToCloudinary(projectImageFile, "projects")
      : null;

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        link,
        projectImage: projectImageUrl,
        techStack: {
          create: skillsArray.map((skillId) => ({
            skill: { connect: { id: skillId } },
          })),
        },
      },
    });

    return NextResponse.json(
      { message: "Project berhasil disimpan!", project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error di API:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan proyek!" },
      { status: 500 }
    );
  }
}
