import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Backend } from "../utils/BackendRoute";
import type { User } from "../types/types";

type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetching User profile
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${Backend}/api/profileId`, {
          credentials: "include",
        });
        if (res.ok) {
          const user: User = await res.json();
          setCurrentUser(user);
          console.log(user);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setCurrentUser(null);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error(`useAuth must be used within AuthProvider`);
  return ctx;
};
