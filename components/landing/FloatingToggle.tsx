"use client";

import { useState } from "react";
import { Sun, Moon, Menu, X, LogIn } from "lucide-react";
import Link from "next/link";

export default function FloatingToggle() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`fixed bottom-5 right-5 flex flex-col items-end gap-3`}>
      <button
        onClick={() => setOpen(!open)}
        className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg flex flex-col gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <Link
            href="/auth/login"
            className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-800 rounded-md shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <LogIn className="w-4 h-4" /> Login
          </Link>
        </div>
      )}
    </div>
  );
}
