"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function About() {
  const [aboutContent, setAboutContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch("/api/about", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch about data");
        const result = await res.json();
        setAboutContent(result.description || "About tidak tersedia"); // Default if no description
      } catch (error) {
        console.error("Error fetching about data:", error);
        setAboutContent("About tidak tersedia"); // Default on error
      }
    };
    fetchAboutData();
  }, []);

  return (
    <section
      id="about"
      className="bg-blue-50 text-gray-800 py-20 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold text-blue-700 mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Me
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mb-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {aboutContent}
        </motion.p>
      </div>
    </section>
  );
}
