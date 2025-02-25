"use client";

import useSWR from "swr";
import { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ToastNotification } from "../Toast-Sweetalert2/Toast";
import { CreateProjectSchema } from "@/lib/validation/project";
import MultiSelectDropdown from "../dropdown/MultiSelectDropdown";
import Loading from "./Loading";
import ErrorServer from "../card/errorServer";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Gagal mengambil data");
    return res.json();
  });

interface Option {
  value: string;
  label: string;
}

const EditProjectForm = () => {
  const params = useParams();
  const id = params?.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    projectImage: null as File | null,
    existingImage: "",
    selectedSkills: [] as Option[],
  });

  const [skills, setSkills] = useState<Option[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const { data: skillsData, error: skillsError } = useSWR(
    "/api/skill",
    fetcher
  );
  const { data: projectData, error: projectError } = useSWR(
    id ? `/api/projects/${id}` : null,
    fetcher
  );

  useEffect(() => {
    if (skillsData) {
      setSkills(
        skillsData.map((skill: { id: string; name: string }) => ({
          value: skill.id,
          label: skill.name,
        }))
      );
    }
  }, [skillsData]);

  useEffect(() => {
    if (projectData) {
      setFormData((prev) => ({
        ...prev,
        title: projectData.title || "",
        description: projectData.description || "",
        link: projectData.link || "",
        existingImage: projectData.projectImage || "",
        selectedSkills:
          projectData.techStack?.map(
            (stack: { skill: { id: string; name: string } }) => ({
              value: stack.skill.id,
              label: stack.skill.name,
            })
          ) ?? [],
      }));
    }
  }, [projectData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      projectImage: e.target.files?.[0] || null,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationResult = CreateProjectSchema.safeParse({
      title: formData.title,
      description: formData.description,
      link: formData.link,
      projectImage: formData.projectImage,
      skills: formData.selectedSkills.map((skill) => skill.value),
    });

    if (!validationResult.success) {
      const errorMessages: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        errorMessages[err.path[0]] = err.message;
      });
      setErrors(errorMessages);
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    const requestData = new FormData();
    requestData.append("title", formData.title);
    requestData.append("description", formData.description);
    requestData.append("link", formData.link);
    if (formData.projectImage) {
      requestData.append("projectImage", formData.projectImage);
    } else {
      requestData.append("existingImage", formData.existingImage);
    }
    requestData.append(
      "skills",
      JSON.stringify(formData.selectedSkills.map((s) => s.value))
    );

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        body: requestData,
      });

      if (!response.ok) throw new Error("Gagal memperbarui data");

      ToastNotification(
        "success",
        `${formData.title} has been successfully updated`
      );
      router.push("/dashboard/project");
    } catch (error) {
      console.error(error);
      ToastNotification("error", "Gagal memperbarui proyek");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (projectError || skillsError) {
    return <ErrorServer />;
  }

  if (!projectData) {
    return <Loading />;
  }

  return (
    <div className="w-full px-4 md:px-8 py-6 md:py-8 bg-neutral-50 rounded-lg shadow">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Edit Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" className="block text-lg font-medium">
              Judul Project
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border rounded-md transition-all duration-200 ${
                errors.title
                  ? "border-red-500 animate-shake"
                  : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
              }`}
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="link" className="block text-lg font-medium">
              Link
            </Label>
            <Input
              id="link"
              value={formData.link}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border rounded-md transition-all duration-200 ${
                errors.link
                  ? "border-red-500 animate-shake"
                  : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
              }`}
            />
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
              onChange={handleFileChange}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="techstack" className="block text-lg font-medium">
              Tech Stack
            </Label>
            <MultiSelectDropdown
              options={skills}
              selectedOptions={formData.selectedSkills}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, selectedSkills: selected }))
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
            Deskripsi
          </Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 w-full px-3 py-2 border rounded-md transition-all duration-200 ${
              errors.description
                ? "border-red-500 animate-shake"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
            }`}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-white ${
              isSubmitting
                ? "bg-blue-600 opacity-50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/dashboard/project")}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectForm;
