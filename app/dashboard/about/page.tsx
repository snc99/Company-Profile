"use client";

import { useState, useEffect } from "react";
import { PencilIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "@/components/custom-ui/Loading";
import {
  DeleteConfirmation,
  ToastNotification,
} from "@/components/Toast-Sweetalert2/Toast";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<{
    id: string;
    description: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("/api/about/");
        if (!response.ok) {
          throw new Error("Gagal mengambil data tentang");
        }
        const data: { id: string; description: string } = await response.json();
        setAboutData(data);
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const handleDelete = async () => {
    const isConfirmed = await DeleteConfirmation();

    if (isConfirmed && aboutData?.id) {
      try {
        const response = await fetch(`/api/about/${aboutData.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Gagal menghapus data.");
        }

        setAboutData(null);

        setTimeout(() => {
          fetchAboutData();
        }, 500);

        ToastNotification("success", "About deleted successfully");
      } catch (error) {
        setError("Terjadi kesalahan saat menghapus data.");
        console.error("Error saat menghapus data:", error);
      }
    }
  };

  const fetchAboutData = async () => {
    try {
      const response = await fetch("/api/about/");
      if (!response.ok) {
        throw new Error("Gagal mengambil data tentang");
      }
      const data: { id: string; description: string } = await response.json();
      setAboutData(data);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setError("Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-white border border-gray-200 rounded-lg">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">
        About Page
      </h2>

      {aboutData && aboutData.id && aboutData.description ? (
        <>
          <p className="text-lg text-gray-700">{aboutData.description}</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
              onClick={() => {
                router.push(`/dashboard/about/edit/${aboutData.id}`);
              }}
            >
              <PencilIcon className="h-5 w-5" />
            </button>

            <button
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
              onClick={handleDelete}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 italic text-center">
          Belum ada deskripsi About.
        </p>
      )}
    </div>
  );
}
