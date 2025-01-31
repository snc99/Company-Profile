"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HomeFormProps {
  initialMotto: string;
  onSubmit: (motto: string, cvFile?: File) => void;
  isSubmitting?: boolean;
}

const HomeForm: React.FC<HomeFormProps> = ({
  initialMotto,
  onSubmit,
  isSubmitting,
}) => {
  const [motto, setMotto] = useState(initialMotto);
  const [cvFile, setCvFile] = useState<File | undefined>(undefined);

  const handleMottoChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMotto(e.target.value);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(motto, cvFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="motto">Motto</Label>
        <Input
          type="text"
          id="motto"
          value={motto}
          onChange={handleMottoChange}
          placeholder="Enter motto"
          required
        />
      </div>

      <div>
        <Label htmlFor="cvLink">CV (PDF)</Label>
        <Input
          type="file"
          id="cvLink"
          accept="application/pdf"
          onChange={handleCvChange}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default HomeForm;
