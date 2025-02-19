"use client";

import { useState, useEffect } from "react";
import CreatePersonalInfoForm from "@/components/custom-ui/CreatePersonalInfoForm";
import { useRouter } from "next/navigation";
import Loading from "@/components/custom-ui/Loading";
import { ToastNotification } from "@/components/Toast-Sweetalert2/Toast";
import { Button } from "@/components/ui/button";

export default function CreatePersonalInfo() {
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
        ToastNotification("error", errorData.message || "Gagal mengirim data.");
        return;
      }

      router.push("/dashboard/home");
      router.refresh();
    } catch (error) {
      console.error("Error sending data:", error);
      ToastNotification("error", "Gagal mengirim data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      {!isDataExist ? (
        <div>
          <CreatePersonalInfoForm
            initialMotto=""
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="w-fit text-center">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg">
              <strong>Perhatian:</strong> Data sudah ada. Anda tidak bisa
              menambah data lagi.
            </div>
            <div className="w-full flex justify-end">
              <Button
                onClick={() => router.push("/dashboard/home")}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
              >
                Kembali
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
