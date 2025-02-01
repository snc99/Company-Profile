"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/custom-ui/Loading";

interface HomeData {
  id: string;
  motto: string;
  cvLink: string;
}

const HomePage = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("/api/home");
        const data = await response.json();

        if (response.ok) {
          setHomeData(data);
        } else {
          setError(data.message || "Error fetching data");
        }
      } catch {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      location.reload();
    }, 500);
  };

  const handleDelete = async (type: "motto" | "cv") => {
    if (!homeData) return;

    const isConfirmed = confirm(
      `Apakah Anda yakin ingin menghapus ${type.toUpperCase()}?`
    );
    if (!isConfirmed) return;

    try {
      const response = await fetch(`/api/home/${homeData.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(`${type} berhasil dihapus`);
        setHomeData((prev) =>
          prev ? { ...prev, [type === "motto" ? "motto" : "cvLink"]: "" } : null
        );
      } else {
        setError("Gagal menghapus data");
      }
    } catch {
      setError("Error saat menghapus data");
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="border p-6 max-w-md text-center">
          <CardHeader>
            <h2 className="text-xl font-semibold text-red-600">
              Terjadi Kesalahan
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <Button onClick={handleRetry} variant="outline" className="mt-4">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!homeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <img src="/no-data.svg" alt="No data" className="w-40 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Belum Ada Data</h2>
        <p className="text-gray-500">
          Silakan tambahkan motto dan CV terlebih dahulu.
        </p>
        <Button className="mt-4">Tambah Data</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {/* Motto Card */}
      <Card className="border p-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">Motto</h2>
        </CardHeader>
        <CardContent>
          <p>{homeData?.motto || "Belum ada motto"}</p>
        </CardContent>
        <div className="flex justify-between mt-4">
          <Button variant="outline">Edit Motto</Button>
          <Button onClick={() => handleDelete("motto")} variant="destructive">
            Delete Motto
          </Button>
        </div>
      </Card>

      {/* CV Card */}
      <Card className="border p-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">CV</h2>
        </CardHeader>
        <CardContent>
          {homeData.cvLink ? (
            <Button
              onClick={() => window.open(homeData?.cvLink, "_blank")}
              variant="outline"
              className="w-full"
            >
              Download CV
            </Button>
          ) : (
            <p className="text-gray-500">CV belum diunggah</p>
          )}
        </CardContent>
        <div className="flex justify-between mt-4">
          <Button variant="outline">Edit CV</Button>
          <Button onClick={() => handleDelete("cv")} variant="destructive">
            Delete CV
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
