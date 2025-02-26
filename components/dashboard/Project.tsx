"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description?: string;
  link?: string;
  projectImage?: string;
  techStack: { skill: { photo: string; name: string } }[];
}

const Project = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Gagal mengambil data project");
        const data: Project[] = await res.json();
        setProjects(data);
      } catch {
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400">Belum ada project.</p>
      ) : (
        projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="w-full h-[200px] relative overflow-hidden rounded-lg">
                <Image
                  src={project.projectImage || "/images/placeholder.png"}
                  alt={project.title}
                  width={400}
                  height={250}
                  className="rounded-lg object-cover w-full"
                />
              </div>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{project.description}</p>
              <div className="mt-4 flex justify-between items-center">
                {project.link && (
                  <Link
                    href={project.link}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    View Project
                  </Link>
                )}
                <div className="flex space-x-2">
                  {project.techStack.map(({ skill }) => (
                    <div
                      key={skill.name}
                      className="flex items-center space-x-1"
                    >
                      <Image
                        src={skill.photo || "/images/placeholder.png"}
                        alt={skill.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Project;
