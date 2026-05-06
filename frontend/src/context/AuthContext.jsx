import { createContext, useContext, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("mgrm_user") || "null")
  );

  const login = async (form) => {
    const res = await API.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("mgrm_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const register = async (form) => {
    const res = await API.post("/auth/register", form);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("mgrm_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("mgrm_user");
  //   setUser(null);
  // };
  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
  toast.success("Logged out successfully");
};

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);