"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToastNotification } from "../Toast-Sweetalert2/Toast";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { AboutSchema } from "@/lib/validation/about";

type AboutFormData = z.infer<typeof AboutSchema>;

const CreateAboutForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(AboutSchema),
  });

  const onSubmit = async (data: AboutFormData) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: data.description }), // ✅ Sesuai dengan skema Zod
      });

      if (!response.ok) {
        throw new Error("Failed to add data.");
      }

      ToastNotification("success", "About added successfully");
      router.push("/dashboard/about");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred.";
      setError(errorMessage);
      ToastNotification("error", errorMessage);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label
          htmlFor="description"
          className="block text-lg font-medium text-gray-700"
        >
          About <span className="text-red-500 ml-1 font-bold">*</span>
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your description"
          required
          rows={10}
        />
        {errors.description && (
          <p className="text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/dashboard/about")}
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          Back
        </Button>
      </div>
    </form>
  );
};

export default CreateAboutForm;
