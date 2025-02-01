"use client";

import { useState, useEffect } from "react";
import HomeForm from "@/components/custom-ui/HomeForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CreateHome() {
  const handleBack = () => {
    router.push("/dashboard/home");
  };

  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataExist, setIsDataExist] = useState(false); // state untuk cek data sudah ada

  // Cek data yang sudah ada
  useEffect(() => {
    const checkIfDataExists = async () => {
      const response = await fetch("/api/home");
      if (response.ok) {
        const data = await response.json();
        if (data.motto) {
          setIsDataExist(true); // Jika motto sudah ada
        }
      }
    };

    checkIfDataExists();
  }, []);

  const handleFormSubmit = async (motto: string, cvFile?: File) => {
    setIsSubmitting(true);

    // Jika data sudah ada, beri tahu pengguna dan hentikan proses
    if (isDataExist) {
      toast({
        title: "Data sudah ada",
        description: "Anda tidak bisa menambah motto lagi.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("motto", motto);
    if (cvFile) {
      formData.append("cv", cvFile);
    }

    try {
      const response = await fetch("/api/home", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      toast({ title: "Success", description: "Data berhasil dikirim!" });

      router.push("/dashboard/home");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Gagal mengirim data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Home Form</h1>

      {isDataExist ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
          <strong>Perhatian:</strong> Data sudah ada. Anda tidak bisa menambah
          motto dan CV lagi.
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <HomeForm
            initialMotto=""
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
