// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Handle active section based on scroll position
  useEffect(() => {
    const sections = [
      "hero",
      "about",
      "skills",
      "work-experience",
      "project",
      "contact",
    ];
    const handleScroll = () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll smoothly when clicking on a section link
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-transparent">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center h-16">
        <div className="hidden md:flex space-x-8">
          {["About", "Skills", "Work Experience", "Project", "Contact"].map(
            (item) => {
              const id = item.toLowerCase().replace(" ", "-");
              return (
                <motion.button
                  key={id}
                  onClick={() => handleScroll(id)}
                  className={`transition text-lg ${
                    activeSection === id
                      ? "text-gray-400 font-semibold"
                      : "text-blue-500"
                  } hover:text-gray-400`}
                  whileHover={{ scale: 1.05 }} // Adding scale effect on hover
                  whileTap={{ scale: 0.95 }} // Adding tap effect
                >
                  {item}
                </motion.button>
              );
            }
          )}
        </div>

        {/* Hamburger menu for mobile view */}
        <div className="md:hidden absolute right-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-500 focus:outline-none text-2xl"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden backdrop-blur-lg bg-transparent border border-gray-700 rounded-lg">
          {["About", "Skills", "Work Experience", "Project", "Contact"].map(
            (item) => {
              const id = item.toLowerCase().replace(" ", "-");
              return (
                <motion.button
                  key={id}
                  onClick={() => {
                    handleScroll(id);
                    setIsOpen(false); // Close the menu on click
                  }}
                  className={`block px-4 py-3 text-lg ${
                    activeSection === id
                      ? "text-gray-400 font-semibold"
                      : "text-blue-500"
                  } hover:text-gray-400`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.button>
              );
            }
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
