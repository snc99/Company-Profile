"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Skill {
  id: number;
  name: string;
  photo: string;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skill", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch skills data");
        const result = await res.json();
        setSkills(result);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section
      id="skills"
      className="bg-blue-50 text-gray-800 py-20 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold text-blue-700 mb-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Skills
        </motion.h2>

        {skills.length > 0 ? (
          // Jika ada skill, tampilkan grid
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {skills.map((skill) => (
              <motion.div
                key={skill.id}
                className="relative group overflow-hidden rounded-xl bg-white shadow-md p-4 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src={skill.photo}
                  alt={skill.name}
                  width={80}
                  height={80}
                  className="transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-blue-700/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                  <p className="text-white font-semibold text-lg">
                    {skill.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Jika tidak ada skill, tampilkan teks di tengah halaman
          <div className="flex items-center justify-center">
            <p className="text-gray-500 text-lg">Skills tidak tersedia</p>
          </div>
        )}
      </div>
    </section>
  );
}
