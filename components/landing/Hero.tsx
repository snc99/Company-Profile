"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import SocialMediaLinks from "./SocialMediaLinks";

const Hero = () => {
  const [data, setData] = useState<{
    motto: string | null;
    cvLink: string | null;
  }>({
    motto: null,
    cvLink: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/home", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch home data");
        const result = await res.json();
        setData({ motto: result.motto, cvLink: result.cvLink });
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section
      className="min-h-screen bg-blue-50 text-center px-6 sm:px-8 flex flex-col items-center justify-center"
      id="Hero"
    >
      <motion.div
        className="max-w-2xl w-full mx-auto text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 mb-4">
          Muhamad Irvan Sandy
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6">
          {data.motto || "Motto tidak tersedia"}
        </p>

        {/* Tombol Download CV dan Contact */}
        <div className="flex space-x-3 items-center justify-center mb-6">
          {data.cvLink ? (
            <a
              href={data.cvLink}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-md shadow-md text-sm hover:bg-blue-600 transition"
            >
              <Download size={16} className="mr-2" />
              Download CV
            </a>
          ) : (
            <button
              disabled
              className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md shadow-md text-sm cursor-not-allowed"
            >
              <Download size={16} className="mr-2" />
              CV Tidak Tersedia
            </button>
          )}
          <a
            href="#contact"
            className="flex items-center px-4 py-2 border border-blue-700 text-blue-700 rounded-md shadow-md text-sm hover:bg-blue-700 hover:text-white transition"
          >
            <Mail size={16} className="mr-2" />
            Contact Me
          </a>
        </div>
      </motion.div>
      <SocialMediaLinks />
    </section>
  );
};

export default Hero;
