"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  DeleteConfirmation,
  ToastNotification,
} from "../Toast-Sweetalert2/Toast";

interface WorkExperienceCardProps {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  isPresent: boolean;
  description?: string | null;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedData: Partial<WorkExperienceCardProps>) => void;
}

export default function WorkExperienceCard({
  id,
  companyName,
  position,
  startDate,
  endDate,
  isPresent,
  description,
  onDelete,
}: // onUpdate,
WorkExperienceCardProps) {
  const router = useRouter();
  useState({
    companyName,
    position,
    startDate,
    endDate,
    isPresent,
    description,
  });

  async function handleDelete() {
    const isConfirmed = await DeleteConfirmation();

    if (!isConfirmed) return;

    onDelete(id);
    ToastNotification("success", `${companyName} deleted successfully!`);
  }

  return (
    <Card className="p-4 shadow-lg rounded-lg">
      <CardContent>
        <h3 className="text-xl font-semibold">{companyName}</h3>
        <p className="text-gray-600">{position}</p>
        <p className="text-sm text-gray-500">
          {format(new Date(startDate), "MMM yyyy")} -{" "}
          {isPresent
            ? " Present"
            : endDate
            ? ` ${format(new Date(endDate), "MMM yyyy")}`
            : " Unknown"}
        </p>
        {description && (
          <p className="mt-2 text-gray-700 text-sm">{description}</p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => router.push(`/dashboard/work-experience/edit/${id}`)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
