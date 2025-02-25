import { prisma } from "@/lib/prisma";

export async function fetchWorkExperiences() {
  const response = await fetch("/api/work-experience");
  if (!response.ok) throw new Error("Failed to fetch work experien");
  return response.json();
}

interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  isPresent: boolean;
  description?: string | null;
}

export async function updateWorkExperience(
  id: string,
  data: Partial<WorkExperience>
) {
  try {
    const updatedExperience = await prisma.workExperience.update({
      where: { id },
      data,
    });

    return updatedExperience;
  } catch (error) {
    console.error("Error updating work experience:", error);
    throw new Error("Failed to update work experience.");
  }
}

export const deleteWorkExperience = async (id: string) => {
  try {
    const response = await fetch(`/api/work-experience/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      let errorData: string | object = "Unknown error";
      try {
        errorData = await response.json();
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        errorData = await response.text();
      }

      if (
        typeof errorData === "object" &&
        errorData !== null &&
        "error" in errorData
      ) {
        console.error("Error data:", (errorData as { error: string }).error);
        throw new Error(
          (errorData as { error: string }).error ||
            "Failed to delete work experience"
        );
      } else {
        console.error("Error data:", errorData);
        throw new Error(errorData as string);
      }
    }

    if (response.status === 204) {
      console.log("No content returned, deletion successful");
      return { message: "Work experience deleted successfully" };
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error in deleteWorkExperience:", error);
    throw error;
  }
};
