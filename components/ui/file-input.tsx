import * as React from "react";
import { Input } from "@/components/ui/input"; // Asumsi Anda menggunakan komponen Input dari ShadCN UI

interface FileInputProps {
  onChange: (file: File) => void;
  accept: string;
  required?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({
  onChange,
  accept,
  required,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <Input
      type="file"
      accept={accept}
      onChange={handleFileChange}
      required={required}
    />
  );
};
