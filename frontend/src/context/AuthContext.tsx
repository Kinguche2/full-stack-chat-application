import { createContext, ReactNode, useContext, useState } from "react";

export interface AuthContextType {
  authUser: UserInfo | null;
  setAuthUser: (user: UserInfo | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
interface UserInfo {
  signInUser: {
    userId: string;
    email: string;
    profileImage?: string;
    gender?: string;
    emailVerified?: boolean;
    firstName?: string;
    lastName?: string;
  };
  token?: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<UserInfo | null>(() => {
    const userInfo = localStorage.getItem("chat-app");
    return userInfo ? JSON.parse(userInfo) : null;
  });
  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
