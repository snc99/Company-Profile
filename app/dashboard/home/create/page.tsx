"use client";

import { useState } from "react";
import HomeForm from "@/components/custom-ui/HomeForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CreateHome() {
  const router = useRouter();

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Home Form</h1>
      <HomeForm
        initialMotto=""
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
