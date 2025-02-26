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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skill", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch skills data");
        const result = await res.json();
        setSkills(result);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Animasi muncul satu per satu
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }, // Efek muncul berurutan lebih cepat
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

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

        {loading ? (
          // Skeleton Loader (Efek Loading)
          <motion.div
            className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-x-5 gap-y-5 max-w-[600px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                className="w-[80px] h-[80px] bg-gray-300 animate-pulse rounded-lg shadow-md"
                variants={itemVariants}
              />
            ))}
          </motion.div>
        ) : skills.length > 0 ? (
          // Jika ada skill, tampilkan animasi fade-in stagger
          <div className="flex justify-center">
            <motion.div
              className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-x-5 gap-y-5 max-w-[600px] mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  className="relative group overflow-hidden rounded-lg bg-white shadow-md w-[80px] h-[80px] flex items-center justify-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Image
                    src={skill.photo}
                    alt={skill.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-fill"
                  />
                  <div className="absolute inset-0 bg-blue-700/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <p className="text-white font-semibold text-xs">
                      {skill.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          // Jika tidak ada data
          <div className="flex items-center justify-center">
            <p className="text-gray-500 text-lg">Skills tidak tersedia</p>
          </div>
        )}
      </div>
    </section>
  );
}
