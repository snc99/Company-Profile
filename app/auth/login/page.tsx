"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/components/custom-ui/Loading";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return <Loading />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEmailError("");
    setPasswordError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      if (result.error.includes("Terlalu banyak percobaan")) {
        setError(result.error);
      } else if (result.error.toLowerCase().includes("email")) {
        setEmailError(result.error);
      } else if (result.error.toLowerCase().includes("password")) {
        setPasswordError(result.error);
      } else {
        setError(result.error);
      }
    } else {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {/* Error Rate Limit Tetap di Atas */}
        {error && error.includes("Terlalu banyak percobaan") && (
          <p className="text-sm text-orange-500 mb-4 text-center font-bold">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 rounded-md transition-all duration-200
              ${
                emailError
                  ? "border-2 border-red-500 animate-shake"
                  : "border-2 border-gray-300"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            required
          />
          {emailError && (
            <p className="text-sm text-red-500 mt-1">{emailError}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 rounded-md transition-all duration-200
              ${
                passwordError
                  ? "border-2 border-red-500 animate-shake"
                  : "border-2 border-gray-300"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            required
          />
          {passwordError && (
            <p className="text-sm text-red-500 mt-1">{passwordError}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
