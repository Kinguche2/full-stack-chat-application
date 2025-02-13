import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import Conversation from "../Dto/conversation";
import { useLogout } from "./useLogout";
import { baseUrl } from "../utils/baseUrl";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { authUser } = useAuthContext();
  const { logout } = useLogout();

  useEffect(() => {
    const getConversation = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser?.token}`,
          },
        });

        const data = await res.json();
        console.log(data);
        if (data.statusCode === 401) {
          logout();
        }
        if (data.error) {
          throw new Error(data.message);
        }
        setConversations(data);
      } catch (error: any) {
        toast.error(`The error is from me ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    getConversation();
  }, []);
  return { conversations, loading };
};

export default useGetConversations;
