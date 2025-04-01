import { useState } from "react";

export const useRegister = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmitAuth = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null); 

      await new Promise((resolve) => setTimeout(resolve, 3000)); 

      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json(); 

      if (!res.ok) {
        console.log("Error")
        throw new Error(data.message || "Error while submitting form");
      }

      setLoading(false);
      return data; 
    } catch (error: any) {
      setLoading(false);
      setError(error.message || "An unknown error occurred"); 
    }
  };

  return { loading, error, onSubmitAuth };
};
