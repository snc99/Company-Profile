"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const EditFormProject = () => {
  const [project, setProject] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Deskripsi:", project);
    // Tambahkan logika untuk menyimpan data
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 md:py-8 bg-neutral-50 rounded-lg shadow">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Edit Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="project"
            className="block text-lg font-medium text-gray-700"
          >
            project <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Input
            type="text"
            id="project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Isikan deskripsi anda"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Submit
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/dashboard/project")}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Kembali
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditFormProject;
