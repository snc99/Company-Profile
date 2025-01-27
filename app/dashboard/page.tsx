"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import dari next/navigation untuk client-side navigation

export default function Layout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Pastikan komponen hanya dirender di klien
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || status === "loading") return; // Tunggu hingga komponen dirender dan status selesai

    if (!session) {
      router.push("/auth/login"); // Arahkan ke login jika tidak ada session
    }
  }, [session, status, router, isMounted]);

  if (status === "loading" || !isMounted) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // Jangan tampilkan apa pun jika session kosong
  }

  return (
    <section>
      <div className="h-full mx-2 sm:mx-4 md:mx-6 lg:mx-8">
        <h1>Welcome to the Dashboard, {session.user?.name}</h1>
        <p>Email: {session.user?.email}</p>
        <p>Bug : ketika login masih bisa akses /auth/login</p>
      </div>
    </section>
  );
}
