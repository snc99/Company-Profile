import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServerCrash } from "lucide-react";

const handleRetry = () => {
  setTimeout(() => {
    location.reload();
  }, 500);
};

export default function ErrorServer() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md bg-red-100 border border-red-500 shadow-lg">
        <CardContent className="p-6 text-center flex flex-col items-center gap-4">
          <ServerCrash className="text-red-600 w-16 h-16" />
          <h2 className="text-2xl font-bold text-red-600">Server Error</h2>
          <p className="text-gray-700 text-lg">
            Failed to load data. Please try again later.
          </p>
          <Button
            onClick={handleRetry}
            className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
