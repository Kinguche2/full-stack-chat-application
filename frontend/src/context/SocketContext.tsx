import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useAuthContext } from "./AuthContext";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

interface SocketContextProps {
  socket: Socket | null; // Socket instance or null if not initialized
  onlineUser: string[]; // List of online users
}

const defaultValue: SocketContextProps = {
  socket: null,
  onlineUser: [],
};

const SocketContext = createContext<SocketContextProps>(defaultValue);

interface SocketProviderProps {
  children: React.ReactNode; // React children
}

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider: React.FC<SocketProviderProps> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUser, setOnlineUsers] = useState<string[]>([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io(`${window.location.origin}`, {
        // Pass custom headers like Authorization
        auth: {
          token: `${authUser?.token}`,
        },
      });

      socket.on("connect", () => console.log("WebSocket Connected ✅"));
      socket.on("connect_error", (err) => {
        console.error("WebSocket Error ❌", err);
        toast.error("Failed to connect to the chat server");
      });

      socket.on("getOnlineUsers", (data: { onlineUsers: string[] }) => {
        setOnlineUsers(data.onlineUsers);
      });

      setSocket(socket);

      return () => {
        if (socket) {
          socket.disconnect(); // Use disconnect() instead of close()
          setSocket(null);
        }
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
