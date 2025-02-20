"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import Loading from "./Loading";
import { UpdateSkillSchema } from "@/lib/validation/skillSchema";
import { ToastNotification } from "../Toast-Sweetalert2/Toast";

const EditFormSkill = () => {
  const router = useRouter();
  const { id } = useParams(); // Ambil ID skill dari URL
  const [skill, setSkill] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [originalSkill, setOriginalSkill] = useState("");
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; photo?: string }>({});

  useEffect(() => {
    if (!id) return;

    const fetchSkill = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/skill/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data skill");

        const data = await res.json();
        setSkill(data.name);
        setOriginalSkill(data.name);
        setPreview(data.photo);
        setOriginalPhoto(data.photo);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSkill();
  }, [id]);

  useEffect(() => {
    const skillChanged = skill.trim() !== originalSkill.trim();
    const photoChanged = preview !== originalPhoto;

    setIsChanged(skillChanged || photoChanged);
  }, [skill, preview, originalSkill, originalPhoto]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);

    if (file) {
      const newPreview = URL.createObjectURL(file);
      setPreview(newPreview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = UpdateSkillSchema.safeParse({ name: skill, photo });

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: formattedErrors.name?.[0],
        photo: formattedErrors.photo?.[0],
      });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", skill);
      if (photo) formData.append("photo", photo);

      const res = await fetch(`/api/skill/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal mengupdate skill");

      ToastNotification("success", `${skill} has been successfully updated!`);
      router.replace("/dashboard/skills");
    } catch (error) {
      console.error("Error:", error);
      ToastNotification("error", "Terjadi kesalahan saat mengupdate skill");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 350);
    }
  };

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="w-full px-4 md:px-8 py-6 md:py-8 bg-neutral-50 rounded-lg shadow">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Edit Skill
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="skill"
            className="block text-lg font-medium text-gray-700"
          >
            Nama Skill <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Input
            type="text"
            id="skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            required
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
            Foto Skill
          </Label>
          <Input type="file" id="photo" onChange={handlePhotoChange} />

          {preview && (
            <div className="mt-2">
              <Image
                src={preview}
                alt="Preview"
                width={80}
                height={80}
                className="object-cover rounded-md"
              />
            </div>
          )}
          {errors.photo && (
            <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={loading || isFetching || !isChanged}
            className={`px-4 py-2 rounded-md text-white ${
              loading || isFetching || !isChanged
                ? "bg-blue-600 opacity-50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Save Changes"}
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

export default EditFormSkill;
