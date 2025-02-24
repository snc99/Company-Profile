"use client";

import useSWR from "swr";
import {
  deleteWorkExperience,
  fetchWorkExperiences,
  updateWorkExperience,
} from "@/lib/work-experience";
import WorkExperienceCard from "./WorkExperianceCard";
import Loading from "./Loading";

interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  isPresent: boolean;
  description?: string | null;
}

const fetcher = async () => {
  try {
    const data = await fetchWorkExperiences();
    return data.slice(0, 4);
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    return [];
  }
};

export default function WorkExperienceList() {
  const {
    data: workExperiences,
    error,
    isLoading,
    mutate,
  } = useSWR<WorkExperience[]>("/api/work-experience", fetcher);

  const handleDelete = async (id: string) => {
    try {

      const responseData = await deleteWorkExperience(id);

      if (responseData && responseData.message) {
        mutate(); 
      } else {
        alert("Failed to delete work experience, data not found.");
      }
    } catch (error: unknown) {
      console.error("Error deleting work experience:", error);

      if (error instanceof Error) {
        alert(`Failed to delete work experience! Error: ${error.message}`);
      } else {
        alert("An unknown error occurred while deleting work experience.");
      }
    }
  };

  const handleUpdate = async (id: string, updatedData: Partial<WorkExperience>) => {
    try {
      console.log("Updating work experience with id:", id);
      
      await updateWorkExperience(id, updatedData);
  
      console.log("Work experience updated successfully!");
      
      mutate(); // Refresh data setelah update
    } catch (error) {
      console.error("Error updating work experience:", error);
      alert("Failed to update work experience!");
    }
  };

  if (error)
    return <p className="text-center text-red-500">Error fetching data</p>;
  if (isLoading) return <Loading />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {workExperiences?.map((work) => (
        <WorkExperienceCard
          key={work.id}
          {...work}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}
