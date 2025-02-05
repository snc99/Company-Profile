"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/custom-ui/Loading";
import SocialMediaTable from "@/components/custom-ui/Tabel-Sosmed";
import { DeleteButton } from "@/components/button/DeleteButton"; // Import DeleteButton
import { showToast } from "@/components/Toast-Sweetalert2/Toast";

interface HomeData {
  id: string;
  motto: string;
  cvLink: string;
}

interface SocialMediaItem {
  platform: string;
  url: string;
  photo: string;
}

const HomePage = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [socialMediaData, setSocialMediaData] = useState<SocialMediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("/api/home");
        const data = await response.json();

        console.log("Fetched home data:", data); // Log data yang diterima

        if (response.ok) {
          setHomeData(data);
        } else {
          setError(data.message || "Error fetching data");
        }
      } catch (err) {
        console.error("Error fetching home data:", err); // Log error jika fetch gagal
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    const fetchSocialMediaData = async () => {
      try {
        const response = await fetch("/api/social-media");
        const data = await response.json();

        if (response.ok) {
          setSocialMediaData(data);
        } else {
          setError("Failed to fetch social media data");
        }
      } catch (err) {
        console.error("Error fetching social media data:", err); // Log error jika fetch gagal
        setError("Error fetching social media data");
      }
    };

    fetchHomeData();
    fetchSocialMediaData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      location.reload();
    }, 500);
  };


// Sweet aler toast 
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/home/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("success", "Data berhasil dihapus!");
        setHomeData(null); // Clear data setelah penghapusan
      } else {
        showToast("error", "Gagal menghapus data!");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("error", "Terjadi kesalahan saat menghapus data!");
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

  return (
    <>
      <div className="grid grid-cols-1 gap-6 p-4">
        {/* Motto & CV Card */}
        <Card className="border border-gray-200 rounded-lg shadow-md p-6 min-w-0 bg-white w-full">
          <CardHeader className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Motto & CV</h2>
          </CardHeader>
          <CardContent>
            {/* Row for Motto and CV */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Motto Section */}
              <div>
                <h3 className="text-lg font-medium">Motto</h3>
                <p className="text-gray-700 mt-2">
                  {homeData?.motto || "Motto belum tersedia"}
                </p>
              </div>

              {/* CV Section */}
              <div>
                <h3 className="text-lg font-medium">CV</h3>
                {homeData?.cvLink ? (
                  <Button
                    onClick={() => window.open(homeData.cvLink, "_blank")}
                    variant="outline"
                    className="w-full mt-2 bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Download CV
                  </Button>
                ) : (
                  <p className="text-gray-500 mt-2">CV belum diunggah</p>
                )}
              </div>
            </div>
          </CardContent>

          {/* Edit and Delete Actions */}
          {(homeData?.motto || homeData?.cvLink) && (
            <div className="flex justify-end mt-6 space-x-4">
              {/* Edit Button */}
              <Link href={`/dashboard/home/edit/${homeData?.id}`}>
                <Button
                  variant="outline"
                  className="py-2 text-sm text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                  Edit
                </Button>
              </Link>

              {/* Delete Button */}
              <DeleteButton
                onDelete={handleDelete} // Pass handleDelete ke DeleteButton
                id={homeData.id} // Pass id ke DeleteButton
                loading={loading}
                label="Delete"
              />
            </div>
          )}
        </Card>

        {/* Social Media Table */}

        <SocialMediaTable data={socialMediaData} />
      </div>
    </>
  );
};

export default HomePage;
