"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Code } from "lucide-react";

const About = () => {
  const [about, setAbout] = useState<{ description: string | null }>({
    description: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/about");
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        setAbout(data);
      } catch {
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  return (
    <div>
      {/* About */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Code className="text-purple-600" />
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : about.description ? (
            <p>{about.description}</p>
          ) : (
            <p className="text-gray-400">Belum ada deskripsi.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
