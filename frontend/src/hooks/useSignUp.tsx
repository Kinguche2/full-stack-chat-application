import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { SignUp } from "../Dto/signUp";

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    gender,
  }: SignUp) => {
    const success = await handleInputErrors({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      gender,
    });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password, gender }),
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        throw new Error(data.message);
      }
      localStorage.setItem("chat-app", JSON.stringify(data));
      setAuthUser(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, signup };
};

export default useSignUp;

const handleInputErrors = async ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  gender,
}: SignUp) => {
  // Check for empty fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !gender
  ) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return false;
  }
  return true;
};
