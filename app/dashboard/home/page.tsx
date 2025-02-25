"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/custom-ui/Loading";
import SocialMediaTable from "@/components/custom-ui/Tabel-Sosmed";
import { DeleteButton } from "@/components/button/DeleteButton";
import {
  DeleteConfirmation,
  ToastNotification,
} from "@/components/Toast-Sweetalert2/Toast";
import ErrorServer from "@/components/card/errorServer";

interface PersonalInfo {
  id: string;
  motto: string;
  cvLink: string;
  cvFilename: string;
}

interface SocialMediaItem {
  id: string;
  platform: string;
  url: string;
  photo: string;
}

const HomePage = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [socialMediaData, setSocialMediaData] = useState<SocialMediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPersonalInfo();
    fetchSocialMediaData();
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      const response = await fetch("/api/home");
      const data = await response.json();

      if (response.ok) {
        setPersonalInfo(data);
      } else {
        setError(data.message || "Error fetching data");
      }
    } catch {
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
    } catch {
      setError("Error fetching social media data");
    }
  };

  const handleDeletePersonalInfo = async () => {
    const isConfirmed = await DeleteConfirmation();
    if (!isConfirmed || !personalInfo?.id) return;

    try {
      const response = await fetch(`/api/home/${personalInfo.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data.");
      }

      setPersonalInfo(null);

      setTimeout(() => {
        fetchPersonalInfo();
      }, 500);

      ToastNotification(
        "success",
        "Your personal information has been deleted"
      );
    } catch (error) {
      setError("Terjadi kesalahan saat menghapus data.");
      console.error("Error saat menghapus data:", error);
    }
  };

  const handleDeleteSocialMedia = async (id: string) => {
    const isConfirmed = await DeleteConfirmation();
    if (!isConfirmed) return;

    const socialMediaItem = socialMediaData.find((item) => item.id === id);
    const platformName = socialMediaItem
      ? socialMediaItem.platform
      : "Social media";

    try {
      const response = await fetch(`/api/social-media/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Gagal menghapus ${platformName}!`);
      }

      ToastNotification("success", ` Your ${platformName} has been deleted!`);

      setTimeout(() => {
        fetchSocialMediaData();
      }, 500);
    } catch (error) {
      console.error(`Error deleting ${platformName}:`, error);
      ToastNotification(
        "error",
        `Terjadi kesalahan saat menghapus ${platformName}!`
      );
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return <ErrorServer />;
  }

  return (
    <>
      <div className="grid md:grid-cols-1 gap-6 p-4 w-full">
        <Card className="border border-gray-200 rounded-lg shadow-md p-6 min-w-0 bg-white w-full">
          <CardHeader className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium">Motto</h3>
                <p className="text-gray-700 mt-2">
                  {personalInfo?.motto || "Motto belum tersedia"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">CV</h3>
                {personalInfo?.cvLink ? (
                  <Button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = personalInfo.cvLink;
                      a.download = personalInfo.cvFilename; // Menyertakan nama asli file
                      a.click(); // Trigger download
                    }}
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

          {(personalInfo?.motto || personalInfo?.cvLink) && (
            <div className="flex justify-end mt-6 space-x-4">
              <Link
                href={`/dashboard/home/edit-personal-info/${personalInfo?.id}`}
              >
                <Button
                  variant="outline"
                  className="py-2 text-sm text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                  Edit
                </Button>
              </Link>

              <DeleteButton
                onDelete={handleDeletePersonalInfo}
                id={personalInfo.id}
                loading={loading}
                label="Delete"
              />
            </div>
          )}
        </Card>
        <div className="w-full">
          <SocialMediaTable
            data={socialMediaData}
            onDelete={handleDeleteSocialMedia}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
