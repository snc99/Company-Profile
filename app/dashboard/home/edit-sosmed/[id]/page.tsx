"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EditFormSosmed from "@/components/custom-ui/EditFormSosmed";
import Loading from "@/components/custom-ui/Loading";

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  photo: File | null;
}

export default function EditSosmedPage() {
  const [socialMediaData, setSocialMediaData] = useState<SocialMedia | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/social-media/${id}`);
        if (!res.ok) {
          throw new Error("Gagal mengambil data.");
        }
        const data: SocialMedia = await res.json();
        setSocialMediaData({
          ...data,
          photo: null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>{error}</div>;
  if (!socialMediaData) return <div>Data tidak ditemukan.</div>;

  // Handle form submission and update data
  const handleUpdate = (updatedData: SocialMedia) => {
    setSocialMediaData(updatedData); // Update data setelah form berhasil dikirim
  };

  return (
    <div>
      <EditFormSosmed
        socialMediaData={socialMediaData}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
