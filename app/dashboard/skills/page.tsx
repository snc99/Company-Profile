"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import SkillTable from "@/components/custom-ui/Table-Skill";
import ErrorServer from "@/components/card/errorServer";

interface Skill {
  id: string;
  name: string;
  photo: string;
}

const SkillPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skill");
        if (!response.ok) throw new Error("Gagal mengambil data skill.");

        const data: Skill[] = await response.json();
        setSkills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      }
    };

    fetchSkills();
  }, []);

  return (
    <>
      <div className="flex items-center justify-center mb-12">
        <Sparkles className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-800">Skill</h2>
      </div>
      {error ? (
        <ErrorServer />
      ) : (
        skills && <SkillTable skills={skills} />
      )}
    </>
  );
};

export default SkillPage;
