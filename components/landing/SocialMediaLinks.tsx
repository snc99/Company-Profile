"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface SocialMedia {
  platform: string;
  url: string;
  photo: string;
}

const SocialMediaLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([]);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        // Perbaikan URL endpoint untuk API sosial media
        const res = await fetch("/api/social-media", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch social media data");
        const result = await res.json();
        setSocialLinks(result);
      } catch (error) {
        console.error("Error fetching social media:", error);
      }
    };
    fetchSocialMedia();
  }, []);

  return (
    <motion.div
      className="flex space-x-4 justify-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {socialLinks.length > 0 ? (
        socialLinks.map((social) => (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full overflow-hidden border border-blue-700 shadow-lg hover:scale-110 transition-transform"
          >
            <Image
              src={social.photo}
              alt={social.platform}
              className="w-full h-full object-cover"
              width={80}
              height={80}
            />
          </a>
        ))
      ) : (
        <p className="text-gray-500">Social media tidak tersedia</p>
      )}
    </motion.div>
  );
};

export default SocialMediaLinks;
