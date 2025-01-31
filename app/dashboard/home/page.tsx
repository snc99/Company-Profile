"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          setHomeData(data); // Simpan data di state
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

  const handleEdit = () => {
    // Logika untuk edit data (misalnya membuka form modal atau halaman edit)
    console.log("Edit clicked");
  };

  const handleDelete = async () => {
    if (homeData) {
      try {
        const response = await fetch(`/api/home/${homeData.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          console.log("Home data deleted successfully");
          setHomeData(null); // Hapus data setelah berhasil dihapus
        } else {
          setError("Failed to delete home data");
        }
      } catch {
        setError("Error deleting home data");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {/* Motto Card */}
      <Card className="border p-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">Motto</h2>
        </CardHeader>
        <CardContent>
          <p>{homeData?.motto}</p>
        </CardContent>
        <div className="flex justify-between mt-4">
          <Button onClick={handleEdit} variant="outline">
            Edit Motto
          </Button>
          <Button onClick={handleDelete} variant="destructive">
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
          <Button
            onClick={() => window.open(homeData?.cvLink, "_blank")}
            variant="outline"
            className="w-full"
          >
            Download CV
          </Button>
        </CardContent>
        <div className="flex justify-between mt-4">
          <Button onClick={handleEdit} variant="outline">
            Edit CV
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            Delete CV
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
