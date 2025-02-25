import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WorkExperienceSchema } from "@/lib/validation/workExperience";
import { z } from "zod";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id.trim() === "") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const workExperienceExists = await prisma.workExperience.findUnique({
      where: { id },
    });

    if (!workExperienceExists) {
      return NextResponse.json(
        { error: "Work experience not found" },
        { status: 404 }
      );
    }

    const deletedWorkExperience = await prisma.workExperience.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Work experience deleted successfully",
        id: deletedWorkExperience.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting work experience (server):", error);
    return NextResponse.json(
      { error: "Server error while deleting work experience" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const formData = await req.formData();
    const body = {
      companyName: formData.get("companyName") as string,
      position: formData.get("position") as string,
      startDate: formData.get("startDate") as string,
      endDate:
        formData.get("endDate") === ""
          ? null
          : (formData.get("endDate") as string),
      description:
        formData.get("description") === ""
          ? null
          : (formData.get("description") as string),
    };

    const validatedData = WorkExperienceSchema.parse(body);

    const isPresent = !validatedData.endDate;

    const updatedExperience = await prisma.workExperience.update({
      where: { id },
      data: {
        companyName: validatedData.companyName,
        position: validatedData.position,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        isPresent,
        description: validatedData.description || null,
      },
    });

    return NextResponse.json(
      { success: true, data: updatedExperience },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Validasi gagal:", error);
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    console.error("🔥 Server Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const experience = await prisma.workExperience.findUnique({
      where: { id },
    });

    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Work experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: experience.id,
          companyName: experience.companyName,
          position: experience.position,
          startDate: experience.startDate.toISOString(),
          endDate: experience.endDate ? experience.endDate.toISOString() : null,
          description: experience.description || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
