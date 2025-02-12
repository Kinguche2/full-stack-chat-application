import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useAuthContext } from "./AuthContext";
import { io, Socket } from "socket.io-client";

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
  onlineUser: string; // List of online users
}

const defaultValue: SocketContextProps = {
  socket: null,
  onlineUser: "",
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
  const [onlineUser, setOnlineUsers] = useState<string>("");
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io(`http://localhost:5000`, {
        // Pass custom headers like Authorization
        auth: {
          token: `${authUser?.token}`,
        },
      });

      setSocket(socket);

      // socket.on() is used to listen to the events. can be used both on client and server side
      socket.on("getOnlineUsers", (onlineUsers: string[]) => {
        //console.log(onlineUsers);
        const users = JSON.stringify(onlineUsers);
        setOnlineUsers(users);
        console.log(users);
      });

      return () => {
        if (socket) {
          socket.close();
        }
      };
    } else {
      if (socket) {
        socket.close();
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
