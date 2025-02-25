"use client";

import useSWR from "swr";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/custom-ui/Loading";
import {
  DeleteConfirmation,
  ToastNotification,
} from "@/components/Toast-Sweetalert2/Toast";
import { useRouter } from "next/navigation";
import ErrorServer from "@/components/card/errorServer";

interface Project {
  id: string;
  title: string;
  description?: string;
  link?: string;
  projectImage?: string;
  techStack: { skill: { photo: string; name: string } }[];
}

const fetcher = async (url: string): Promise<Project[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export default function ProjectPage() {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/dashboard/project/edit/${id}`);
  };

  const handleDelete = async (
    id: string,
    title: string,
    mutate: () => void
  ) => {
    const isConfirmed = await DeleteConfirmation();
    if (!isConfirmed) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      mutate();
      ToastNotification("success", `${title} deleted successfully`);
    } catch (error) {
      console.error("Error deleting project:", error);
      ToastNotification("error", "Failed to delete project");
    }
  };

  const {
    data: projects,
    error,
    isLoading,
    mutate,
  } = useSWR<Project[]>("/api/projects", fetcher);

  if (isLoading) return <Loading />;
  if (error) return <ErrorServer />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Project List</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Card key={project.id} className="bg-white shadow-lg rounded-lg">
            <CardHeader>
              <div className="w-full h-[200px] relative overflow-hidden rounded-lg">
                <Image
                  src={project.projectImage || "/default-project.jpg"}
                  alt={project.title}
                  width={400}
                  height={250}
                  className="rounded-lg object-cover w-full"
                />
              </div>
              <CardTitle className="mt-4 text-lg font-semibold">
                {project.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {project.description || "No description available"}
              </p>
              <div className="mt-4 flex justify-between items-center">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View Project
                  </a>
                )}
                <div className="flex space-x-2">
                  {project.techStack ? (
                    project.techStack.map((tech, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <Image
                          src={tech.skill.photo}
                          alt="Tech Stack"
                          width={24}
                          height={24}
                          className="rounded-full border-2 border-gray-600"
                        />
                      </div>
                    ))
                  ) : (
                    <span>No tech stack available</span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  onClick={() => handleEdit(project.id)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-rose-300 text-rose-800 rounded-md hover:bg-[#FF2A00] hover:text-white text-sm"
                  onClick={() =>
                    handleDelete(project.id, project.title, mutate)
                  }
                >
                  Delete
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
