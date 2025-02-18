"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateAboutForm from "@/components/custom-ui/CreateAboutForm"; 
import { showToast } from "@/components/Toast-Sweetalert2/Toast"; 
import Loading from "@/components/custom-ui/Loading";
import { Button } from "@/components/ui/button";

export default function CreateAboutPage() {
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkDataExist = async () => {
      try {
        const response = await fetch("/api/about");
        const data = await response.json();

        if (data.description) {
          setDataExists(true); 
        }
      } catch (error) {
        console.error("Error checking data:", error);
        showToast("error", "Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };

    checkDataExist();
  }, []);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    ); 
  }

  if (dataExists) {
    return (
      <div className="w-full px-4 md:px-8 py-6 md:py-8 bg-neutral-50 rounded-lg shadow flex justify-center items-center">
        <div className="w-full text-center">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg">
            <strong>Perhatian:</strong> Data About sudah ada. Anda tidak bisa
            menambah data lagi.
          </div>

          <div className="w-full flex justify-end">
            <Button
              onClick={() => router.push("/dashboard/about")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
            >
              Kembali
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-6 md:py-8 bg-neutral-50 rounded-lg shadow">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Create About
      </h2>

      <CreateAboutForm />
    </div>
  );
}
