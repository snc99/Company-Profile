"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Ganti dengan Textarea
import { z } from "zod";
import { ToastNotification } from "../Toast-Sweetalert2/Toast";

interface EditFormAboutProps {
  initialDescription: string;
  id: string;
}

const aboutSchema = z.object({
  about: z
    .string()
    .min(3, "Deskripsi harus memiliki minimal 3 karakter.")
    .max(1000, "Deskripsi terlalu panjang, maksimal 1000 karakter.")
    .nonempty("Deskripsi tidak boleh kosong."),
});

export default function EditFormAbout({
  initialDescription,
  id,
}: EditFormAboutProps) {
  const [about, setAbout] = useState(initialDescription);
  const [aboutError, setAboutError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAboutError(null);

    const parsedData = aboutSchema.safeParse({ about });

    if (!parsedData.success) {
      setAboutError(parsedData.error.errors[0]?.message || "Error terjadi.");
      ToastNotification(
        "error",
        parsedData.error.errors[0]?.message || "Deskripsi tidak valid."
      );
      return;
    }

    try {
      const response = await fetch(`/api/about/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: about }),
      });

      if (!response.ok) {
        throw new Error("Failed to update data.");
      }

      ToastNotification("success", "Deskripsi berhasil diperbarui!");
      router.replace("/dashboard/about");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred.";
      setAboutError(errorMessage);

      ToastNotification("error", errorMessage);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-neutral-100 shadow rounded-lg">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">
        Edit About Page
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="about"
            className="block text-lg font-medium text-gray-700"
          >
            About <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Isikan deskripsi anda"
            required
            rows={10}
          />
          {aboutError && (
            <p className="text-red-500 text-sm mt-1">{aboutError}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Submit
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/dashboard/about")}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Kembali
          </Button>
        </div>
      </form>
    </div>
  );
}
