"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const SocialMediaForm = () => {
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !url || !photo) {
      setMessage("Semua kolom harus diisi!");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("platform", platform);
    formData.append("url", url);
    formData.append("photo", photo);

    try {
      const res = await fetch("/api/social-media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Data berhasil diunggah!");
        setMessage(""); // Reset message
        setPlatform("");
        setUrl("");
        setPhoto(null);

        router.push("/dashboard/home");
      } else {
        setMessage(data.message || "Terjadi kesalahan saat mengunggah data.");
        toast.error(data.message || "Terjadi kesalahan.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error details:", error);
        setMessage(
          `Terjadi kesalahan: ${error.message || "Silakan coba lagi."}`
        );
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      } else {
        setMessage("Terjadi kesalahan yang tidak diketahui.");
        toast.error("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Form Sosial Media
      </h2>
      {message && <p className="text-center text-red-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="platform"
            className="block text-sm font-medium text-gray-700"
          >
            Platform
          </label>
          <input
            type="text"
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan platform"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan URL"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700"
          >
            Foto
          </label>
          <input
            type="file"
            id="photo"
            onChange={(e) =>
              setPhoto(e.target.files ? e.target.files[0] : null)
            }
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-lg font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {loading ? "Mengunggah..." : "Kirim"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialMediaForm;
