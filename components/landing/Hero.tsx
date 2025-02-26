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

  const [loading, setLoading] = useState(true);
  const [displayText, setDisplayText] = useState("M");
  const fullText = "uhamad Irvan Sandy";
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/home", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch home data");
        const result = await res.json();
        setData({ motto: result.motto, cvLink: result.cvLink });
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const typingSpeed = isDeleting ? 100 : 150;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (index < fullText.length) {
          setDisplayText((prev) => prev + fullText[index]);
          setIndex(index + 1);
        } else {
          setIsDeleting(true);
        }
      } else {
        if (index > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
          setIndex(index - 1);
        } else {
          setIsDeleting(false);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [index, isDeleting]);

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
          {displayText}
          <span className="animate-blink">|</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6">
          {loading ? "Loading..." : data.motto || "Motto tidak tersedia"}
        </p>

        <div className="flex space-x-3 items-center justify-center mb-6">
          {loading ? (
            <button
              disabled
              className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md shadow-md text-sm cursor-not-allowed"
            >
              <Download size={16} className="mr-2" />
              Loading...
            </button>
          ) : data.cvLink ? (
            <a
              href={data.cvLink}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-md shadow-md text-sm transition"
            >
              <Download size={16} className="mr-2 " />
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
            className="flex items-center px-4 py-2 border border-blue-700 text-blue-700 rounded-md shadow-md text-sm hover:bg-gradient-to-r from-blue-500 to-blue-800 hover:text-white transition"
          >
            <Mail size={16} className="mr-2" />
            Contact Me
          </a>
        </div>
      </motion.div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <SocialMediaLinks />
      )}
    </section>
  );
};

export default Hero;
