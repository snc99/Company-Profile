"use client";

import { useState, useEffect } from "react";
import HomeForm from "@/components/custom-ui/HomeForm";
import { useRouter } from "next/navigation";
import Loading from "@/components/custom-ui/Loading";
import { showToast } from "@/components/Toast-Sweetalert2/Toast"; // Import toast yang benar

export default function CreateHome() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataExist, setIsDataExist] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkDataExist = async () => {
      try {
        const response = await fetch("/api/home");
        const data = await response.json();
        if (data && data.motto) {
          setIsDataExist(true);
        }
      } catch (error) {
        console.error("Error checking data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkDataExist();
  }, []);

  const handleFormSubmit = async (motto: string, cvFile?: File) => {
    setIsSubmitting(true);

    // Validasi motto
    if (motto.length < 3) {
      showToast("error", "Motto harus memiliki minimal 3 karakter.");
      setIsSubmitting(false);
      return;
    }

    // Validasi file CV di frontend
    if (cvFile) {
      if (cvFile.type !== "application/pdf") {
        showToast("error", "File harus berupa PDF");
        setIsSubmitting(false);
        return;
      }
      if (cvFile.size > 10 * 1024 * 1024) {
        showToast("error", "File tidak boleh lebih dari 10MB");
        setIsSubmitting(false);
        return;
      }
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
        const errorData = await response.json();
        if (errorData.errors) {
          const errors: { [key: string]: string } = {};
          errorData.errors.forEach(
            (error: { message: string; field: string }) => {
              errors[error.field] = error.message;
            }
          );
        } else {
          showToast("error", errorData.message || "Gagal mengirim data.");
        }
        return;
      }

      showToast("success", "Data berhasil dikirim!");
      router.push("/dashboard/home");
      router.refresh();
    } catch (error) {
      console.error("Error sending data:", error);
      showToast("error", "Gagal mengirim data.");
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
          <strong>Perhatian:</strong> Data sudah ada. Anda tidak bisa menambah motto lagi.
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

      <div className="mt-6 flex justify-start">
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
