"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SocialMediaForm from "@/components/custom-ui/CreateSosmedForm";
import { ToastNotification } from "@/components/Toast-Sweetalert2/Toast";
const DashboardHome = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    try {
      const res = await fetch("/api/social-media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard/home");
      } else {
        ToastNotification("error", data.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      ToastNotification("error", "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SocialMediaForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default DashboardHome;
