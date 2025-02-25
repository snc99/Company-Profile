"use client";

import useSWR from "swr";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ToastNotification } from "../Toast-Sweetalert2/Toast";
import { CreateProjectSchema } from "@/lib/validation/project";
import MultiSelectDropdown from "../dropdown/MultiSelectDropdown";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Gagal mengambil data");
    return res.json();
  });

interface Option {
  value: string;
  label: string;
}

const CreateProjectForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [skills, setSkills] = useState<Option[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Option[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { data } = useSWR("/api/skill", fetcher);

  useEffect(() => {
    if (data) {
      const formattedSkills = data.map(
        (skill: { id: string; name: string }) => ({
          value: skill.id,
          label: skill.name,
        })
      );
      setSkills(formattedSkills);
    }
  }, [data]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void
  ) => {
    const file = event.target.files?.[0] || null;
    setFile(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationResult = CreateProjectSchema.safeParse({
      title,
      description,
      link,
      projectImage,
      skills: selectedSkills.map((skill) => skill.value),
    });

    if (!validationResult.success) {
      const errorMessages: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        errorMessages[err.path[0]] = err.message;
      });
      setErrors(errorMessages);
      return;
    }

    setErrors({});

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("link", link || "");

    if (projectImage) {
      formData.append("projectImage", projectImage);
    }

    const skillsArray = selectedSkills.map((skill) => skill.value);
    formData.append("skills", JSON.stringify(skillsArray));

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error("Gagal menyimpan data");
      }

      ToastNotification("success", `${title} added successfully`);
      router.push("/dashboard/project");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 md:py-8 bg-neutral-50 rounded-lg shadow">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Tambah Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" className="block text-lg font-medium">
              Judul Project <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-md transition-all duration-200 ${
                errors.title
                  ? "border-red-500 animate-shake"
                  : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
              }`}
              placeholder="Masukkan judul proyek"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="link" className="block text-lg font-medium">
              Link
            </Label>
            <Input
              type="text"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-md transition-all duration-200 ${
                errors.link
                  ? "border-red-500 animate-shake"
                  : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
              }`}
              placeholder="Masukkan link proyek"
            />
            {errors.link && (
              <p className="text-red-500 text-sm mt-1">{errors.link}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="projectImage" className="block text-lg font-medium">
              Gambar Project
            </Label>
            <Input
              type="file"
              id="projectImage"
              onChange={(e) => handleFileChange(e, setProjectImage)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="techstack" className="block text-lg font-medium">
              Tech Stack <span className="text-red-500">*</span>
            </Label>
            <MultiSelectDropdown
              options={skills}
              selectedOptions={selectedSkills}
              onChange={(selectedOptions) =>
                setSelectedSkills([...selectedOptions])
              }
              error={!!errors.skills}
            />
            {errors.skills && (
              <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="description" className="block text-lg font-medium">
            Deskripsi <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`mt-1 w-full px-3 py-2 border rounded-md transition-all duration-200 ${
              errors.description
                ? "border-red-500 animate-shake"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
            }`}
            placeholder="Masukkan deskripsi proyek"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;
