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
  const [isLoaded, setIsLoaded] = useState(false); // Untuk menunda tampilan

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const res = await fetch("/api/social-media", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch social media data");
        const result = await res.json();
        setSocialLinks(result);

        // Tunda tampilan selama 500ms agar terasa lebih smooth
        setTimeout(() => setIsLoaded(true), 80);
      } catch (error) {
        console.error("Error fetching social media:", error);
        setSocialLinks([]); // Jika gagal, set array kosong agar tidak undefined
      }
    };
    fetchSocialMedia();
  }, []);

  return (
    <motion.div
      className="flex space-x-4 justify-center"
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"} // Tampilkan setelah delay
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } }, // Stagger animasi tiap anak
      }}
    >
      {socialLinks.length > 0 ? (
        socialLinks.map((social, index) => (
          <motion.a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full overflow-hidden border border-blue-700 shadow-lg hover:scale-110 transition-transform"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }} // Efek muncul satu per satu
          >
            <Image
              src={social.photo}
              alt={social.platform}
              className="w-full h-full object-cover"
              width={80}
              height={80}
            />
          </motion.a>
        ))
      ) : isLoaded ? (
        <p className="text-gray-500">Social media tidak tersedia</p>
      ) : null}
    </motion.div>
  );
};

export default SocialMediaLinks;
