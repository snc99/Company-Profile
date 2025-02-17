"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/components/custom-ui/Loading";
import EditFormHome from "@/components/custom-ui/EditFormHome";
import { showToast } from "@/components/Toast-Sweetalert2/Toast";

export default function EditHomePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; 
  const [motto, setMotto] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("ID tidak ditemukan");
      router.push("/dashboard/home"); 
      return;
    }

    console.log("Fetching data for ID:", id);

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/home/${id}`);
        if (!response.ok) {
          throw new Error("Data tidak ditemukan");
        }
        const data = await response.json();
        setMotto(data.motto || ""); 
        if (data.cvFile) {
          setCvFile(data.cvFile); 
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("error", "Gagal mengambil data!");
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
        throw new Error("Gagal memperbarui data");
      }

      showToast("success", "Data berhasil diperbarui!");
      router.push("/dashboard/home");
    } catch (error) {
      console.error("Error saving changes:", error);
      showToast("error", "Gagal memperbarui data!");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <EditFormHome
        motto={motto}
        cvFile={cvFile}
        setCvFile={setCvFile}
        onSubmit={handleSaveChanges}
      />
    </>
  );
}
