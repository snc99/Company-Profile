"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const EditFormSkill = () => {
  const [skill, setSkill] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Deskripsi yang dikirim:", skill);
    // Tambahkan logika untuk menyimpan data ke database/API
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 md:py-8 bg-neutral-50 rounded-lg shadow">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Create Skill
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="skill"
            className="block text-lg font-medium text-gray-700"
          >
            skill <span className="text-red-500 ml-1 font-bold">*</span>
          </Label>
          <Input
            type="text"
            id="skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
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
            onClick={() => router.push("/dashboard/skill")}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Kembali
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditFormSkill;
