import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { login as apiLogin, getCurrentUser } from "../api";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
          const { data } = await getCurrentUser();
          setCurrentUser(data);
        }
      } catch (err) {
        console.error("Authentication error:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiLogin(credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
