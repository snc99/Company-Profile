// Mengimpor fungsi formatDateToIndonesia dari lib/formatDate.ts
"use client";

import { formatDateToIndonesia } from "@/lib/formatDate"; // Sesuaikan path jika perlu
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

interface WorkExperienceData {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  description: string;
}

export default function WorkExperience() {
  const [experiences, setExperiences] = useState<WorkExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkExperience = async () => {
      try {
        const res = await fetch("/api/work-experience", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch work experience data");
        const result = await res.json();
        setExperiences(result || []);
      } catch (error) {
        console.error("Error fetching work experience data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkExperience();
  }, []);

  return (
    <section
      id="work-experience"
      className="bg-blue-50 text-gray-800 py-20 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-blue-700 mb-10 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Work Experience
        </motion.h2>

        <div className="relative border-l-4 border-blue-700 ml-6">
          {loading ? (
            <motion.div
              className="mb-10 ml-8 bg-white shadow-md rounded-lg p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-600 italic">Loading...</p>
            </motion.div>
          ) : experiences.length === 0 ? (
            <motion.div
              className="mb-10 ml-8 bg-white shadow-md rounded-lg p-6 text-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center">
                <Briefcase className="text-blue-700 w-10 h-10 mb-2" />
                <p className="text-gray-600 italic">
                  Belum ada pengalaman kerja.
                </p>
              </div>
            </motion.div>
          ) : (
            experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="mb-10 ml-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="absolute w-6 h-6 bg-blue-700 rounded-full left-[-14px] flex items-center justify-center">
                  <Briefcase className="text-white w-4 h-4" />
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-700">
                    {exp.position}
                  </h3>
                  <p className="text-gray-600">
                    {exp.companyName} | {formatDateToIndonesia(exp.startDate)} -{" "}
                    {exp.isPresent
                      ? "Present"
                      : formatDateToIndonesia(exp.endDate || "")}
                  </p>
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
