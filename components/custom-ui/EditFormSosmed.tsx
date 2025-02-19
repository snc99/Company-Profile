import { useState } from "react";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
// import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { ToastNotification } from "../Toast-Sweetalert2/Toast";

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

interface EditFormSosmedProps {
  socialMediaData: {
    id: string;
    platform: string;
    url: string;
    photo: File | null;
  };
  onUpdate: (updatedData: {
    id: string;
    platform: string;
    url: string;
    photo: File | null;
  }) => void;
}

const EditFormSosmed = ({ socialMediaData, onUpdate }: EditFormSosmedProps) => {
  const [newPlatform, setNewPlatform] = useState(socialMediaData.platform);
  const [newUrl, setNewUrl] = useState(socialMediaData.url);
  const [newPhoto, setNewPhoto] = useState<File | null>(socialMediaData.photo);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    platform: string | null;
    url: string | null;
    photo: string | null;
  }>({
    platform: null,
    url: null,
    photo: null,
  });

  const router = useRouter();

  const isSubmitDisabled =
    newPlatform.trim() === socialMediaData.platform.trim() &&
    newUrl.trim() === socialMediaData.url.trim() &&
    newPhoto === socialMediaData.photo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ platform: null, url: null, photo: null });

    try {
      const validatedData = SocialMediaSchema.parse({
        platform: newPlatform,
        url: newUrl,
        photo: newPhoto,
      });
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("platform", validatedData.platform);
      formData.append("url", validatedData.url);
      if (validatedData.photo) formData.append("photo", validatedData.photo);

      await fetch(`/api/social-media/${socialMediaData.id}`, {
        method: "PATCH",
        body: formData,
      });

      onUpdate({
        id: socialMediaData.id,
        platform: newPlatform,
        url: newUrl,
        photo: newPhoto,
      });

      ToastNotification("success", `${newPlatform} updated successfully`);

      router.push("/dashboard/home");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: { platform: string; url: string; photo: string } =
          err.errors.reduce(
            (acc, currentError) => {
              acc[currentError.path[0] as "platform" | "url" | "photo"] =
                currentError.message;
              return acc;
            },
            { platform: "", url: "", photo: "" }
          );
        setErrors(newErrors);
      } else {
        ToastNotification("error", "Something went wrong");
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="platform"
            className="block text-sm font-medium text-gray-700"
          >
            Platform
          </Label>
          <Input
            id="platform"
            type="text"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 rounded-md transition-all duration-200
              ${
                errors.platform
                  ? "border-2 border-red-500 animate-shake"
                  : "border-2 border-gray-300"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          />
          {errors.platform && (
            <p className="text-sm text-red-600">{errors.platform}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            URL
          </Label>
          <Input
            id="url"
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 rounded-md 
              ${
                errors.url
                  ? "border-2 border-red-500 animate-shake"
                  : "border-2 border-gray-300"
              } 
              focus:outline-none focus:ring-0 
              focus:border-blue-500 border-solid`}
          />
          {errors.url && <p className="text-sm text-red-600">{errors.url}</p>}
        </div>

        <div>
          <Label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Photo
          </Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setNewPhoto(e.target.files?.[0] || null)}
            className={`mt-1 block w-full px-3 py-2 rounded-md 
              ${
                errors.photo
                  ? "border-2 border-red-500 animate-shake"
                  : "border-2 border-gray-300"
              } 
              focus:outline-none focus:ring-0 
              focus:border-blue-500 border-solid`}
          />
          {errors.photo && (
            <p className="text-sm text-red-600">{errors.photo}</p>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting || isSubmitDisabled}
            className={` ${
              isSubmitting
                ? "bg-gray-400 cursor-wait"
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
            className=" bg-gray-500 text-white rounded-md hover:bg-gray-700 transition duration-300"
          >
            Kembali
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditFormSosmed;
