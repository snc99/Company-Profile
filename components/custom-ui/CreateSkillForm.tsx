"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CreateSkillSchema } from "@/lib/validation/skillSchema";
import { ToastNotification } from "../Toast-Sweetalert2/Toast";

const CreateSkillForm = () => {
  const [skill, setSkill] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string; photo?: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = CreateSkillSchema.safeParse({ name: skill, photo });

    if (!result.success) {
      setErrors({
        name: result.error.flatten().fieldErrors.name?.[0],
        photo: result.error.flatten().fieldErrors.photo?.[0],
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", skill);
    if (photo) formData.append("photo", photo);

    try {
      const res = await fetch("/api/skill", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan skill");
      }

      ToastNotification("success", `${skill} added successfully!`);

      router.refresh();
      setTimeout(() => {
        setLoading(false);
      }, 400);
      router.push("/dashboard/skills");
    } catch (err) {
      setErrors({
        name: err instanceof Error ? err.message : "An error occurred.",
      });

      ToastNotification(
        "error",
        err instanceof Error ? err.message : "Terjadi kesalahan."
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 md:py-8 bg-neutral-50 rounded-lg shadow">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Create Skill
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="skill"
            className="block text-lg font-medium text-gray-700"
          >
            Name Skill <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Input
            type="text"
            id="skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Name your skill"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="photo"
            className="block text-lg font-medium text-gray-700"
          >
            Foto <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Input
            type="file"
            id="photo"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            className="mt-2 focus:border-none focus:ring-1 focus:border-blue-500 border-solid"
          />
          {errors.photo && (
            <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${
              loading
                ? "bg-blue-600 opacity-50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/dashboard/skills")}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSkillForm;
