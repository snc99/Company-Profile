"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ToastNotification } from "../Toast-Sweetalert2/Toast";
import { WorkExperienceSchema } from "@/lib/validation/workExperience";
import { Textarea } from "../ui/textarea";

type WorkExperienceFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
};

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      WorkExperienceSchema.parse({
        ...formData,
        endDate: formData.endDate || null,
        description: formData.description || null,
      });

      setErrors({});

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      await onSubmit(data);
      ToastNotification("success", `${formData.companyName} added successfully`);
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
        ToastNotification("error", "Something went wrong");
      }
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-neutral-50 rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Form Work Experience
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="companyName">
            Company <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="companyName"
            value={formData.companyName}
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
            value={formData.position}
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
              value={formData.startDate}
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
              value={formData.endDate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className={`mt-1 block w-full ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Add some details about your job (optional)"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={loading}
            className={
              loading
                ? "bg-blue-600 opacity-50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
            }
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              router.push("/dashboard/work-experience");
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

export default WorkExperienceForm;
