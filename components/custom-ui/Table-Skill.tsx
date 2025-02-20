"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import {
  DeleteConfirmation,
  ToastNotification,
} from "../Toast-Sweetalert2/Toast";

interface Skill {
  id: string;
  name: string;
  photo: string;
}

const SkillTable = ({ skills: initialSkills }: { skills: Skill[] }) => {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/skill");
      if (!response.ok) throw new Error("Gagal mengambil data skill.");

      const data: Skill[] = await response.json();
      setSkills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id: string) => {
    const isConfirmed = await DeleteConfirmation();
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/skill/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Gagal menghapus skill:", data.error);
        ToastNotification("error", `Error: ${data.error}`);
        return;
      }

      const deletedSkill =
        skills.find((skill) => skill.id === id)?.name || "Skill";

      setSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== id));

      setTimeout(() => {
        fetchSkills();
      });

      ToastNotification("success", `${deletedSkill} berhasil dihapus!`);
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus skill:", error);
      ToastNotification("error", "Gagal menghapus skill");
    }
  };

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg col-span-2 w-full">
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Name Skills
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">Foto</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <tr key={skill.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{skill.name}</td>
                  <td className="px-6 py-4">
                    {skill.photo ? (
                      <Image
                        src={skill.photo}
                        alt={skill.name}
                        className="mt-2 object-cover rounded-md"
                        width={48}
                        height={48}
                        unoptimized
                      />
                    ) : (
                      <span>Gambar tidak tersedia</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/skills/edit/${skill.id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 flex items-center mr-2"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data skill
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SkillTable;
