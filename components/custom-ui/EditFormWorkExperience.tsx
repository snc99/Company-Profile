"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ToastNotification } from "../Toast-Sweetalert2/Toast";
import { WorkExperienceSchema } from "@/lib/validation/workExperience";
import { Textarea } from "../ui/textarea";
import { KeyedMutator } from "swr";
import Loading from "./Loading";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type WorkExperienceFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
  initialDataId?: { id: string } | string;
  isEdit?: boolean;
  mutate?: KeyedMutator<unknown>;
};

const EditFormWorkExperience: React.FC<WorkExperienceFormProps> = ({
  onSubmit,
  loading,
  initialDataId,
  isEdit = false,
}) => {
  const router = useRouter();

  const id =
    typeof initialDataId === "string" ? initialDataId : initialDataId?.id;

  const { data: initialData, error } = useSWR(
    isEdit && id ? `/api/work-experience/${id}` : null,
    fetcher
  );

  const [form, setForm] = useState({
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      WorkExperienceSchema.parse({
        companyName: form.companyName || "",
        position: form.position || "",
        startDate: form.startDate || "",
        endDate: form.endDate || null,
        description: form.description || null,
      });

      setErrors({});
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("companyName", form.companyName);
      formData.append("position", form.position);
      formData.append("startDate", form.startDate);
      if (form.endDate) formData.append("endDate", form.endDate);
      if (form.description) formData.append("description", form.description);

      if (isEdit && id) {
        formData.append("id", id);
      }

      await onSubmit(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          "❌ Zod validation failed:",
          JSON.stringify(error.errors, null, 2)
        );

        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        console.error("🔥 Unknown error:", error);
        ToastNotification("error", "Something went wrong");
      }
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (initialData?.data) {
      setForm({
        companyName: initialData.data.companyName ?? "",
        position: initialData.data.position ?? "",
        startDate: initialData.data.startDate
          ? initialData.data.startDate.split("T")[0]
          : "",
        endDate: initialData.data.endDate
          ? initialData.data.endDate.split("T")[0]
          : "",
        description: initialData.data.description ?? "",
      });
    }
  }, [initialData]);

  if (error) return <p className="text-red-500">Failed to load data</p>;
  if (!initialData && isEdit) return <Loading />;

  return (
    <div className="max-w-full mx-auto p-6 bg-neutral-50 rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        {isEdit ? "Edit Work Experience" : "Add Work Experience"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="company">
            Company <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="company"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            className={`mt-1 block w-full ${
              errors.companyName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="position">
            Position <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="position"
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Enter position"
            className={`mt-1 block w-full ${
              errors.position ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.position && (
            <p className="text-red-500 text-sm mt-1">{errors.position}</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-1/2">
            <Label htmlFor="startDate">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={`mt-1 block w-full ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add some details about your job (optional)"
            className="mt-1 block w-full border-gray-300"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className={`bg-blue-600 text-white rounded-md transition duration-300 ${
              isSubmitting || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              router.push("/dashboard/work-experience");
            }}
            className="bg-gray-500 text-white rounded-md hover:bg-gray-700 transition duration-300"
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditFormWorkExperience;
