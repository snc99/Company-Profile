"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText } from "lucide-react";
import { Button } from "../ui/button";

const PersonalInformations = () => {
  const [data, setData] = useState<{
    motto: string | null;
    cvLink: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/home");
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.log("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-1">
      <Card>
        <CardHeader className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <User className="text-blue-600" />
            <CardTitle>Personal Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-gray-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium">Motto</h3>
              <p className="text-gray-700 mt-2">
                {data?.motto ? data.motto : "Belum ada motto."}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">CV</h3>
              {data?.cvLink ? (
                <a href={data.cvLink} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full mt-2 bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2">
                    <FileText size={18} />
                    Download CV
                  </Button>
                </a>
              ) : (
                <p className="text-gray-700 mt-2">CV belum tersedia.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInformations;
