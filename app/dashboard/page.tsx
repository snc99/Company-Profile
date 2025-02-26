"use client";

import WelcomeSection from "@/components/dashboard/WelcomeSection";
import PersonalInformations from "@/components/dashboard/PersonalInformations";
import WorkExperience from "@/components/dashboard/WorkExperience";
import Project from "@/components/dashboard/Project";
import Skills from "@/components/dashboard/Skills";
import SosialMedia from "@/components/dashboard/SosialMedia";
import About from "@/components/dashboard/About";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-2">
      {/* Welcome Section */}
      <WelcomeSection />

      {/* Personal Information */}
      <PersonalInformations />

      {/* Sosial Media */}
      <SosialMedia />

      {/* About */}
      <About />

      {/* Skills */}
      <Skills />

      {/* Work Experience */}
      <WorkExperience />

      {/* Project */}
      <Project />
    </div>
  );
}
