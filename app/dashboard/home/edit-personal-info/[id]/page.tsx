"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/components/custom-ui/Loading";
import { ToastNotification } from "@/components/Toast-Sweetalert2/Toast";
import EditFormPersonalInfo from "@/components/custom-ui/EditFormPersonalInfo";

export default function EditPersonalInfoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [motto, setMotto] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("ID tidak ditemukan");
      setTimeout(() => router.push("/dashboard/home"), 1000);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/home/${id}`);
        if (!response.ok) {
          throw new Error("Data tidak ditemukan");
        }
        const data = await response.json();

        setMotto(data.motto || "");
      } catch (error) {
        console.error("Error fetching data:", error);
        ToastNotification("error", "Gagal mengambil data!");
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
      };

      const response = await fetch(`/api/home/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui data");
      }

      ToastNotification("success", "Personal info updated successfully!");
      router.push("/dashboard/home");
    } catch (error) {
      console.error("Error saving changes:", error);
      ToastNotification("error", "Gagal memperbarui data!");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <EditFormPersonalInfo
      motto={motto}
      cvFile={cvFile}
      setCvFile={setCvFile}
      onSubmit={handleSaveChanges}
    />
  );
}
