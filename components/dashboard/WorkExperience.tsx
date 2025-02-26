"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  description: string;
}

const WorkExperience = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkExperiences = async () => {
      try {
        const res = await fetch("/api/work-experience");
        if (!res.ok) throw new Error("Gagal mengambil data pengalaman kerja");
        const data: WorkExperience[] = await res.json();
        setExperiences(data);
      } catch {
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkExperiences();
  }, []);

  const formatDate = (date: string | null, isPresent: boolean) => {
    if (isPresent) return "Present";
    return date
      ? new Date(date).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
        })
      : "-";
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : experiences.length === 0 ? (
        <p className="text-gray-400">Belum ada pengalaman kerja.</p>
      ) : (
        experiences.map((exp) => (
          <Card key={exp.id}>
            <CardHeader className="flex items-center gap-2">
              <Briefcase className="text-orange-600" />
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">{exp.companyName}</h3>
              <p className="font-semibold text-gray-700 mb-1">{exp.position}</p>
              <p className="text-gray-500 text-sm">
                {formatDate(exp.startDate, false)} -{" "}
                {formatDate(exp.endDate, exp.isPresent)}
              </p>
              <p className="text-gray-600 mt-2">{exp.description}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default WorkExperience;
