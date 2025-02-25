"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = [
      "hero",
      "about",
      "skills",
      "work-history",
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

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-transparent">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center h-16">
        <div className="hidden md:flex space-x-8">
          {["About", "Skills", "Work History", "Project", "Contact"].map(
            (item) => {
              const id = item.toLowerCase().replace(" ", "-");
              return (
                <Link
                  key={id}
                  href={`#${id}`}
                  className={`transition text-lg ${
                    activeSection === id
                      ? "text-gray-400 font-semibold"
                      : "text-blue-500"
                  } hover:text-gray-400`}
                >
                  {item}
                </Link>
              );
            }
          )}
        </div>

        <div className="md:hidden absolute right-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-200 focus:outline-none text-2xl"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden backdrop-blur-lg bg-transparent border border-gray-700 rounded-lg">
          {["About", "Skills", "Work History", "Project", "Contact"].map(
            (item) => {
              const id = item.toLowerCase().replace(" ", "-");
              return (
                <Link
                  key={id}
                  href={`#${id}`}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-lg ${
                    activeSection === id
                      ? "text-blue-500 font-semibold"
                      : "text-gray-200"
                  } hover:text-blue-500`}
                >
                  {item}
                </Link>
              );
            }
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
