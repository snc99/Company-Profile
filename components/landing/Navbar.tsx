"use client";

import { useState, useEffect } from "react";
import { Menu } from "@headlessui/react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(""); // State untuk section aktif

  // Scroll effect for transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll event untuk active section
  useEffect(() => {
    const sections = [
      "hero",
      "about",
      "skills",
      "project",
      "contact",
      "work-history",
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
    <nav
      className={`fixed w-full z-50 transition-all ${
        isScrolled ? "bg-white-100 bg-opacity" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left - Brand Name */}
        <div className="text-lg font-bold text-blue-700">
          <Link href="/">Muhamad Irvan Sandy</Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {["About", "Skills", "Work History", "Project", "Contact"].map(
            (item) => {
              const id = item.toLowerCase().replace(" ", "-");
              return (
                <Link
                  key={item}
                  href={`#${id}`}
                  className={`transition ${
                    activeSection === id
                      ? "text-blue-700 font-semibold"
                      : "text-gray-700"
                  } hover:text-blue-700`}
                >
                  {item}
                </Link>
              );
            }
          )}
        </div>

        {/* Right - Theme & Login */}
        <div className="flex items-center space-x-4">
          {/* Theme Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition">
              Theme
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg focus:outline-none">
              {["Light", "Dark", "System"].map((theme) => (
                <Menu.Item key={theme}>
                  {({ active }: { active: boolean }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100" : ""
                      } w-full text-left px-4 py-2 text-gray-700`}
                    >
                      {theme} Theme
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>

          {/* Login Button */}
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </Link>
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          {["About", "Skills", "Work History", "project", "Contact"].map(
            (item) => {
              const id = item.toLowerCase().replace(" ", "-");
              return (
                <Link
                  key={item}
                  href={`#${id}`}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 ${
                    activeSection === id
                      ? "text-blue-700 font-semibold"
                      : "text-gray-700"
                  } hover:bg-gray-100 transition`}
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
