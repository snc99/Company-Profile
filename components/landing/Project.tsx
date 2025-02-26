"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Folder } from "lucide-react";
import Image from "next/image";

interface ProjectData {
  id: string;
  title: string;
  description?: string;
  link?: string;
  projectImage?: string;
  techStack: { skill: { photo: string; name: string } }[];
}

export default function Project() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section
      id="project"
      className="bg-blue-50 text-gray-700 py-16 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="max-w-5xl mx-auto">
        {/* Judul */}
        <motion.h2
          className="text-3xl font-bold text-blue-700 mb-10 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Projects
        </motion.h2>

        {/* Loading atau Error */}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : projects.length === 0 ? (
          <motion.div
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Folder className="text-blue-700 w-12 h-12 mb-2" />
            <p className="text-gray-600 italic">
              Belum ada proyek yang tersedia.
            </p>
          </motion.div>
        ) : (
          // Grid Project Cards
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* Tech Stack (Di Kanan Atas) */}
                <div className="absolute top-3 right-3 flex gap-2 bg-white/80 p-1 rounded-md shadow-md">
                  {project.techStack.map((tech, i) => (
                    <motion.img
                      key={i}
                      src={tech.skill.photo || "https://placehold.co/32x32"}
                      alt={tech.skill.name}
                      className="h-8 w-8 rounded-full bg-gray-200 p-1 shadow-sm opacity-80 hover:opacity-100 transition"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>

                {/* Gambar Project */}
                <Image
                  src={project.projectImage || "https://placehold.co/400x300"}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                  width={400}
                  height={400}
                />

                {/* Konten Project */}
                <div className="p-4 flex flex-col">
                  <h3 className="text-lg font-bold text-blue-700">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {project.description || "Tidak ada deskripsi."}
                  </p>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-blue-600 hover:underline"
                    >
                      Visit Project <ExternalLink className="ml-1 w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
