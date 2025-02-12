import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (email: string, password: string) => {
    const success = await handleInputErrors({ email, password });
    if (!success) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.message);
      }
      localStorage.setItem("chat-app", JSON.stringify(data));
      setAuthUser(data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useLogin;

const handleInputErrors = async ({ email, password }: any) => {
  // Check for empty fields
  if (!email || !password) {
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
};
