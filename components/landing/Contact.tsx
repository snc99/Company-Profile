"use client";

import { motion } from "framer-motion";
import { Mail, User, MessageSquare, CheckCircle, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 8000);
  };

  return (
    <section
      id="contact"
      className="min-h-screen bg-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-lg w-full bg-gradient-to-b from-blue-100 to-blue-50 p-8 rounded-lg shadow-lg">
        {/* Judul */}
        <motion.h2
          className="text-3xl font-bold text-blue-700 text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contact Us
        </motion.h2>

        {/* Form */}
        {submitted ? (
          <motion.div
            className="flex items-center justify-center gap-2 text-green-600 font-semibold bg-green-100 p-3 rounded-xl shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="w-6 h-6 text-green-700 animate-bounce" />
            <span>Message sent successfully!</span>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Input Nama */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="pl-10 p-2 w-full rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Input Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="pl-10 p-2 w-full rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Input Pesan */}
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-gray-500" />
              <textarea
                name="message"
                placeholder="Your Message"
                className="pl-10 p-2 w-full rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 h-28"
                required
              ></textarea>
            </div>

            {/* Tombol Kirim */}
            <motion.button
              type="submit"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-5 h-5 text-white" />
              Send Message
            </motion.button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
