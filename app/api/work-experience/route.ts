import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WorkExperienceSchema } from "@/lib/validation/workExperience";
import { z } from "zod";

export async function POST(req: Request) {
  try {
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

    const isPresent = validatedData.endDate === null;

    const newExperience = await prisma.workExperience.create({
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
      { success: true, data: newExperience },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Validasi gagal:", error.errors);
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

export async function GET() {
  try {
    const experiences = await prisma.workExperience.findMany({
      select: {
        id: true,
        companyName: true,
        position: true,
        startDate: true,
        endDate: true,
        isPresent: true,
        description: true,
      },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
