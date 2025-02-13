import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useLogout } from "./useLogout";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const { logout } = useLogout();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation?._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser?.token}`,
          },
        });
        const data = await res.json();
        if (data.statusCode === 401) {
          logout();
        }
        if (data.error) throw new Error(data.error);
        setMessages(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
