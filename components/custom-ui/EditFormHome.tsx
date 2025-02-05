import { useState } from "react";

type EditFormProps = {
  motto: string;
  cvFile: File | null; // Hanya menerima cvFile
  setCvFile: React.Dispatch<React.SetStateAction<File | null>>; // Untuk memperbarui cvFile di komponen induk
  onSubmit: (newMotto: string, newCvFile: File | null) => Promise<void>;
};

const EditFormHome = ({
  motto,
  cvFile,
  setCvFile,
  onSubmit,
}: EditFormProps) => {
  const [newMotto, setNewMotto] = useState(motto);
  const [newCvFile, setNewCvFile] = useState<File | null>(cvFile); // Gunakan prop cvFile sebagai nilai awal
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Mengubah state menjadi sedang mengirim
    await onSubmit(newMotto, newCvFile); // Kirim data ke onSubmit
    setIsSubmitting(false); // Mengubah state menjadi selesai mengirim
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="motto"
          className="block text-sm font-medium text-gray-700"
        >
          Motto
        </label>
        <input
          id="motto"
          type="text"
          value={newMotto}
          onChange={(e) => setNewMotto(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label
          htmlFor="cvFile"
          className="block text-sm font-medium text-gray-700"
        >
          Upload CV
        </label>
        <input
          id="cvFile"
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setNewCvFile(file); // Mengupdate state lokal cvFile
            setCvFile(file); // Mengupdate state global di komponen induk
          }}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        disabled={isSubmitting} // Disable tombol saat sedang mengirim
      >
        {isSubmitting ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditFormHome;
