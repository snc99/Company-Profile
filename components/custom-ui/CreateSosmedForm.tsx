"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const SocialMediaSchema = z.object({
  platform: z
    .string()
    .min(3, { message: "Platform harus memiliki minimal 3 karakter" }),
  url: z
    .string()
    .url({ message: "URL tidak valid." })
    .nonempty({ message: "URL tidak boleh kosong." }),
  photo: z
    .instanceof(File, { message: "Foto wajib di isi" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File yang diupload harus berupa gambar",
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Ukuran foto tidak boleh lebih dari 2 MB",
    })
    .nullable()
    .optional(),
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

// Tambahkan tipe untuk props
type SocialMediaFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
};

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({
  onSubmit,
  loading,
}) => {
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<{
    platform?: string;
    url?: string;
    photo?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      SocialMediaSchema.parse({ platform, url, photo });
      setErrors({});

      if (!photo) {
        setErrors((prev) => ({ ...prev, photo: "Foto wajib diisi" }));
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("platform", platform);
      formData.append("url", url);
      if (photo) {
        formData.append("photo", photo);
      }

      await onSubmit(formData); // Panggil fungsi onSubmit yang diterima sebagai prop

      Toast.fire({ icon: "success", title: "Data berhasil disimpan!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        Toast.fire({
          icon: "error",
          title: "Terjadi kesalahan, coba lagi nanti.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-neutral-50 rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Form Sosial Media
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="platform" className="flex items-center">
            Platform
            <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Input
            type="text"
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Masukkan platform"
            className={`mt-1 block w-full px-3 py-2 rounded-md transition-all duration-200
              ${
                errors.platform
                  ? "border-2 border-red-500 animate-shake"
                  : "border-2 border-gray-300"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          />
          {errors.platform && (
            <p className="text-red-500 text-sm mt-1">{errors.platform}</p>
          )}
        </div>

        <div>
          <Label htmlFor="url">
            URL
            <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Masukkan URL"
            className={`mt-1 block w-full px-3 py-2 rounded-md 
              ${
                errors.url
                  ? "border-2 border-red-500 animate-shake"
                  : "border-2 border-gray-300"
              } 
              focus:outline-none focus:ring-0 
              focus:border-blue-500 border-solid`}
          />
          {errors.url && (
            <p className="text-red-500 text-sm mt-1">{errors.url}</p>
          )}
        </div>

        <div>
          <Label htmlFor="photo">
            Foto
            <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Input
            type="file"
            id="photo"
            className={`mt-1 block w-full px-3 py-2 rounded-md 
              ${
                errors.photo
                  ? "border-2 border-red-500 animate-shake"
                  : "border-2 border-gray-300"
              } 
              focus:outline-none focus:ring-0 
              focus:border-blue-500 border-solid`}
            onChange={(e) =>
              setPhoto(e.target.files ? e.target.files[0] : null)
            }
            accept="image/*"
          />
          {errors.photo && (
            <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className={`${
              isSubmitting || loading
                ? "bg-gray-400 cursor-wait"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded-md transition duration-300`}
          >
            {isSubmitting || loading ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              router.push("/dashboard/home");
            }}
            className="bg-gray-500 text-white rounded-md hover:bg-gray-700 transition duration-300"
          >
            Kembali
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SocialMediaForm;
