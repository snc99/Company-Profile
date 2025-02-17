"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Skema Zod
const HomeSchema = z.object({
  motto: z
    .string()
    .min(3, "Motto minimal 3 karakter")
    .max(1000, "Motto maksimal 1000 karakter")
    .refine((value) => value.trim() !== "", {
      message: "Motto wajib diisi",
    }),

  cv: z
    .custom<File | null>((file) => {
      if (!file) return true;
      if (!(file instanceof File)) return false;
      if (file.type !== "application/pdf") return false;
      if (file.size > 5 * 1024 * 1024) return false;
      return true;
    }, "File harus berupa PDF dan maksimal 5MB")
    .nullable(),
});

type EditFormProps = {
  motto: string;
  cvFile: File | null;
  setCvFile: React.Dispatch<React.SetStateAction<File | null>>;
  onSubmit: (newMotto: string, newCvFile: File | null) => Promise<void>;
};

const EditFormHome = ({
  motto,
  cvFile,
  setCvFile,
  onSubmit,
}: EditFormProps) => {
  const [newMotto, setNewMotto] = useState(motto);
  const [newCvFile, setNewCvFile] = useState<File | null>(cvFile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    try {
      const validatedData = HomeSchema.parse({
        motto: newMotto,
        cv: newCvFile,
      });

      setIsSubmitting(true);
      await onSubmit(validatedData.motto, validatedData.cv);
      setIsSubmitting(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = newMotto === motto && newCvFile === cvFile;

  return (
    <div className="max-w-full mx-auto p-6 md:p-8 bg-neutral-50 rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Edit Motto and CV
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="motto"
            className="block text-sm font-medium text-gray-700"
          >
            Motto <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Input
            id="motto"
            type="text"
            value={newMotto}
            onChange={(e) => setNewMotto(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 rounded-md transition-all duration-200
    ${error ? "border-red-500 animate-shake" : "border-gray-300"}
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            placeholder="Masukkan motto (min. 3 karakter)"
            required
          />

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <div>
          <Label
            htmlFor="cvFile"
            className="block text-sm font-medium text-gray-700"
          >
            Upload CV
          </Label>
          <Input
            id="cvFile"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setNewCvFile(file);
              setCvFile(file);
            }}
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting || isSubmitDisabled}
            className={`${
              isSubmitting
                ? "bg-gray-400 opacity-50 cursor-progress"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
              router.push("/dashboard/home");
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition duration-300"
          >
            Kembali
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditFormHome;
