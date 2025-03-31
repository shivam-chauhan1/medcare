"use client";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface AuthContextType {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/checkLoggedIn", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLogin(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        setIsLogin(true);
        router.push("/doctors");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      if (response.ok) {
        setIsLogin(true);
        router.push("/doctors");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setIsLogin(false);
        router.push("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLogin, setIsLogin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth error");
  }
  return context;
};
