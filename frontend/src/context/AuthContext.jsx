import React, { createContext, useEffect, useState } from "react";
import { getApiURL } from '../lib/route';
import axios from "axios";

const INITIAL_USER = JSON.parse(localStorage.getItem("user")) || null;

export const AuthContext = createContext({
  user: INITIAL_USER,
  loading: false,
  error: null,
  login: () => { },
  logout: () => { },
  setError: () => { },
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(INITIAL_USER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasCompanyOwner, setHasCompanyOwner] = useState(false);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));

    const fetchHasCompany = async () => {
      const response = await axios.get(`${getApiURL()}/companyowner`)
      if (response.status === 200) {
        setHasCompanyOwner(true);
      }
    }
    if (user !== null) {
      fetchHasCompany();
    }
  }, [user]);

  // Function to handle login
  const login = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      setUser(userData);
      setLoading(false);
    } catch (err) {
      setError("Login failed");
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        setError,
        hasCompanyOwner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};