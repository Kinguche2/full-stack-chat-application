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

/* type SocketData = {
  id: string;
  text: string;
  userId: string;
  chatId: string;
  createdAt: string;
};

interface ServerToClientEvents {
  getMessage: (data: SocketData) => void;
}

interface ClientToServerEvents {
  sendMessage: (data: { receiverId: string; data: SocketData }) => void;
  newUser: (id: string) => void;
} */

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
  //const [onlineUser, setOnlineUsers] = useState<string>("");
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      console.log(`The backend is ${window.location.origin}`);
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
      /* socket.on("getOnlineUsers", (onlineUsers: any) => {
        console.log("Online users received:", onlineUsers);
        try {
          const users = JSON.parse(onlineUsers);
          setOnlineUsers(users);
        } catch (error) {
          console.error(
            "❌ JSON Parse Error:",
            error,
            "Raw data:",
            onlineUsers
          );
        }
        //setOnlineUsers(onlineUsers);
      }); */

      /* socket.on("getOnlineUsers", (data) => {
        console.log("Received online users:", data);

        // Ensure `data` is an object, not a string
        if (typeof data === "string") {
          try {
            data = JSON.parse(data); // Convert string to object if necessary
          } catch (error) {
            console.error("❌ JSON Parse Error:", error, "Raw data:", data);
            return;
          }
        }

        // Ensure the data has the expected structure
        if (data?.onlineUsers && Array.isArray(data.onlineUsers)) {
          setOnlineUsers(data.onlineUsers);
        } else {
          console.error("❌ Unexpected format for onlineUsers:", data);
        }
      }); */

      socket.on("getOnlineUsers", (data: { onlineUsers: string[] }) => {
        console.log("Received online users:", data.onlineUsers);
        setOnlineUsers(data.onlineUsers);
      });

      setSocket(socket);

      // socket.on() is used to listen to the events. can be used both on client and server side
      /* socket.on("getOnlineUsers", (onlineUsers: string[]) => {
        //console.log(onlineUsers);
        const users = JSON.stringify(onlineUsers);
        setOnlineUsers(users);
        console.log(users);
      }); */

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
