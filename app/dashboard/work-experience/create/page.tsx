"use client";

import WorkExperienceForm from "@/components/custom-ui/CreateWorkExperienceForm";
import { ToastNotification } from "@/components/Toast-Sweetalert2/Toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateWorkExperiencePage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    try {
      const res = await fetch("/api/work-experience", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        ToastNotification("success", "Work experience berhasil ditambahkan!");
        router.push("/dashboard/work-experience");
      } else {
        ToastNotification("error", data.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      ToastNotification("error", "Terjadi kesalahan, Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div>
        <WorkExperienceForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default CreateWorkExperiencePage;
