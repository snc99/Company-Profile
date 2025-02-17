"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { z } from "zod";

const HomeSchema = z.object({
  motto: z
    .string()
    .min(3, "Motto minimal 3 karakter")
    .max(1000, "Motto maksimal 1000 karakter")
    .refine((value) => value.trim() !== "", {
      message: "Motto wajib diisi",
    }),

  cv: z
    .instanceof(File, { message: "File wajib diisi" })
    .refine((file) => file.type === "application/pdf", {
      message: "File harus berupa PDF",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File maksimal 5MB",
    }),
});

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

interface HomeFormProps {
  initialMotto: string;
  onSubmit: (motto: string, cvFile?: File) => void;
  isSubmitting: boolean;
}

const HomeForm: React.FC<HomeFormProps> = ({ initialMotto }) => {
  const [motto, setMotto] = useState(initialMotto);
  const [cvFile, setCvFile] = useState<File | undefined>(undefined);
  const [cvFileName, setCvFileName] = useState<string>("");
  const [errors, setErrors] = useState<{ motto?: string; cv?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Tambahkan state untuk isSubmitting
  const router = useRouter();

  const handleMottoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMotto(e.target.value);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setCvFile(file);
      setCvFileName(file.name);
    } else {
      setCvFile(undefined);
      setCvFileName("");
    }
  };

  const validateForm = () => {
    try {
      // Memastikan motto dan cvFile valid melalui Zod
      HomeSchema.parse({ motto, cv: cvFile });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("motto", motto);
    if (cvFile) {
      formData.append("cv", cvFile); // Pastikan hanya menambahkan cvFile jika ada
    }

    try {
      const response = await fetch("/api/home", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim data");
      }

      Toast.fire({ icon: "success", title: "Data berhasil dikirim!" });
      router.push("/dashboard/home");
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Terjadi kesalahan, coba lagi nanti.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 md:p-8 bg-neutral-50 rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Create motto and CV
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Input Motto */}
        <div>
          <Label htmlFor="motto" className="block text-lg font-medium mt-2">
            Motto <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Input
            type="text"
            id="motto"
            className={`mt-1 block w-full px-3 py-2 rounded-md transition-all duration-200 
              ${
                errors.motto
                  ? "border-red-500 animate-shake"
                  : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
              }`}
            value={motto}
            onChange={handleMottoChange}
            placeholder="Masukkan motto (min. 3 karakter)"
            required
          />
          {errors.motto && (
            <p className="text-red-500 text-sm mt-1">{errors.motto}</p>
          )}
        </div>

        {/* Input CV */}
        <div className="mt-4">
          <Label htmlFor="cvLink" className="block text-lg font-medium mt-2">
            CV (.pdf) <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Input
            type="file"
            id="cvLink"
            className={`mt-1 block w-full px-3 py-2 border rounded-md transition-all duration-200 ${
              errors.cv
                ? " border-red-500 animate-shake"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
            }`}
            accept="application/pdf"
            onChange={handleCvChange}
          />
          {cvFileName && (
            <p className="text-gray-600 text-sm mt-1">File: {cvFileName}</p>
          )}
          {errors.cv && (
            <p className="text-red-500 text-sm mt-1">{errors.cv}</p>
          )}
        </div>

        {/* Tombol Submit & Kembali */}
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSubmitting
                ? "bg-gray-400 opacity-50 cursor-progress"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
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

export default HomeForm;
