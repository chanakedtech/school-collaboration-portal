import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("accessToken")));

  useEffect(() => {
    async function loadUser() {
      if (!localStorage.getItem("accessToken")) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me/");
        setUser(data);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login/", { email, password });
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    const profile = await api.get("/auth/me/");
    setUser(profile.data);
    return profile.data;
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, logout, isAuthenticated: Boolean(user) }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

