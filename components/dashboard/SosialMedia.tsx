import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  photo: string;
}

const SosialMedia = () => {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSocialMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/social-media?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setSocialMedia(data);
    } catch (err) {
      console.log("Error fetching data:", err);
      setError("Failed to load social media data");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchSocialMedia();
  }, [fetchSocialMedia]);

  return (
    <div className="grid gap-4 md:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Photo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {socialMedia.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.platform}</TableCell>
                      <TableCell>
                        <a
                          href={item.url}
                          className="text-blue-500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.url}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Image
                          src={item.photo}
                          alt={item.platform}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {socialMedia.length >= limit && (
                <Button className="mt-4" onClick={() => setLimit(limit + 5)}>
                  Load More
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SosialMedia;
