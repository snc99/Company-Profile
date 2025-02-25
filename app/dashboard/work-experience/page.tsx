"use client";

import WorkExperienceList from "@/components/custom-ui/WorkExperianceList";

export default function WorkExperienceCards() {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">
        Work Experience
      </h1>
      <WorkExperienceList />
    </div>
  );
}
