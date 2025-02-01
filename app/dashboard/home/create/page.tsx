"use client";

import { useState, useEffect } from "react";
import HomeForm from "@/components/custom-ui/HomeForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Loading from "@/components/custom-ui/Loading";

export default function CreateHome() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataExist, setIsDataExist] = useState(false); // State untuk cek data
  const [loading, setLoading] = useState(true); // State loading

  // Cek apakah data sudah ada di useEffect
  useEffect(() => {
    const checkDataExist = async () => {
      try {
        const response = await fetch("/api/home"); // API untuk cek data
        const data = await response.json();
        if (data && data.motto) {
          setIsDataExist(true);
        }
      } catch (error) {
        console.error("Error checking data:", error);
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    checkDataExist();
  }, []);

  const handleFormSubmit = async (motto: string, cvFile?: File) => {
    setIsSubmitting(true);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Home Form</h1>

      {isDataExist ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
          <strong>Perhatian:</strong> Data sudah ada. Anda tidak bisa menambah
          motto lagi.
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
          onClick={() => router.push("/dashboard/home")}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
