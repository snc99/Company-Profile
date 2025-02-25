"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToastNotification } from "../Toast-Sweetalert2/Toast";
import { AboutSchema } from "@/lib/validation/about";

interface EditFormAboutProps {
  initialDescription: string;
  id: string;
}

export default function EditFormAbout({
  initialDescription,
  id,
}: EditFormAboutProps) {
  const [about, setAbout] = useState(initialDescription);
  const [aboutError, setAboutError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isSubmitDisabled =
    about.trim() === initialDescription.trim() || loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAboutError(null);
    setLoading(true);

    const parsedData = AboutSchema.safeParse({ description: about });

    if (!parsedData.success) {
      setAboutError(parsedData.error.errors[0]?.message || "Error terjadi.");
      setLoading(false);
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

      ToastNotification("success", "About updated");
      router.replace("/dashboard/about");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred.";
      setAboutError(errorMessage);
      ToastNotification("error", errorMessage);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
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
            disabled={isSubmitDisabled}
            className={`px-4 py-2 rounded-md text-white ${
              isSubmitDisabled
                ? "bg-blue-600 opacity-50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Save Changes"}
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
