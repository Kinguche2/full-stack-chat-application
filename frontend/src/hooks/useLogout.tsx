import { useState } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("chat-app");
      Cookies.remove("token"); // Remove JWT token from cookies
      navigate("/login");
      setAuthUser(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
};
