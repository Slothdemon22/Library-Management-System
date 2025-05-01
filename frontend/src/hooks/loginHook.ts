import { useState } from "react";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmitAuth = async (email: string, password: string) => {
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); 
      console.log("Response from server:", data); // Log the response data

      if (!response.ok) {
        throw new Error(data.message || "Error while logging in");
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
      setLoading(false);
    }
  };

  return { loading, error, onSubmitAuth };
};
