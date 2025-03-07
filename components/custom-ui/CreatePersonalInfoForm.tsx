"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ToastNotification } from "../Toast-Sweetalert2/Toast";
import { CreatePersonalInfoSchema } from "@/lib/validation/personalInfo";

interface PersonalInfoProps {
  initialMotto: string;
  onSubmit: (motto: string, cvFile?: File) => void;
  isSubmitting: boolean;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ initialMotto }) => {
  const [motto, setMotto] = useState(initialMotto);
  const [cvFile, setCvFile] = useState<File | undefined>(undefined);
  const [cvFileName, setCvFileName] = useState<string>("");
  const [errors, setErrors] = useState<{ motto?: string; cv?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    const result = CreatePersonalInfoSchema.safeParse({ motto, cv: cvFile });

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      if (err.path[0]) {
        fieldErrors[err.path[0]] = err.message;
      }
    });

    setErrors(fieldErrors);
    return false;
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
      formData.append("cv", cvFile);
    }

    try {
      const response = await fetch("/api/home", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim data");
      }

      ToastNotification("success", "Personal information created successfully");
      router.push("/dashboard/home");
    } catch (error) {
      console.error(error);
      ToastNotification("error", "Something went wrong");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 md:p-8 bg-neutral-50 rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Create Personal Information
      </h2>
      <form onSubmit={handleSubmit}>
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

        <div className="flex justify-end space-x-2 mt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSubmitting
                ? "bg-blue-600 opacity-50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save"}
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

export default PersonalInfo;
