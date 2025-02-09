"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/components/custom-ui/Loading";
import EditFormHome from "@/components/custom-ui/EditFormHome";
import { showToast } from "@/components/Toast-Sweetalert2/Toast";

export default function EditHomePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; // Pastikan id bertipe string
  const [motto, setMotto] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("ID tidak ditemukan");
      router.push("/dashboard/home"); // Redirect jika ID tidak ada
      return;
    }

    console.log("Fetching data for ID:", id); // Log ID yang akan digunakan

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/home/${id}`);
        if (!response.ok) {
          throw new Error("Data tidak ditemukan");
        }
        const data = await response.json();
        setMotto(data.motto || ""); // Pastikan tidak null
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleSaveChanges = async (
    newMotto: string,
    newCvFile: File | null
  ) => {
    if (!id) return;

    try {
      const formData = new FormData();
      formData.append("motto", newMotto);
      if (newCvFile) {
        formData.append("cv", newCvFile);
      }

      const response = await fetch(`/api/home/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      showToast("success", "Data berhasil diperbarui!"); // ✅ Tambahkan Toast di sini

      router.push("/dashboard/home");
    } catch (error) {
      console.error("Error saving changes:", error);
      showToast("error", "Gagal memperbarui data!"); // ✅ Tampilkan error jika gagal
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Edit Home</h1>
      <EditFormHome
        motto={motto}
        cvFile={cvFile}
        setCvFile={setCvFile} // Pastikan prop ini ada di EditFormHome
        onSubmit={handleSaveChanges}
      />
    </div>
  );
}
