import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const WelcomeSection = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
  
    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/auth/login");
      }
    }, [status, router]);
  
    if (status === "loading") {
      return <Skeleton className="h-20 w-full" />;
    }
  return (
    <div>
        <Card className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
          <CardContent className="p-6 text-lg font-semibold">
            Hello, {session?.user?.name} 👋
          </CardContent>
        </Card>
      </div>
  )
}

export default WelcomeSection