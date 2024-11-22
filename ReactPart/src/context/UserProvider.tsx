import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

// const { isLoggedIn, logIn, signOut, getCsrfToken, getUsername, getUserType } = useUser();

interface UserContextType {
  //TODO: loading:boolean; - field to load template while fetching user data
  isLoggedIn: boolean;
  register: (
    username: string,
    password: string,
    userType: string,
    body: string
  ) => Promise<void>;
  logIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getCsrfToken: () => string | null;
  getUsername: () => string | null;
  getUserType: () => string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  //TODO: implement using loading

  const location = useLocation();

  const getCsrfToken = (): string | null => csrfToken;
  const getUsername = (): string | null => username;
  const getUserType = (): string | null => userType;

  const fetchUserInfo = async (): Promise<void> => {
    try {
      const response = await fetch("http://127.0.0.1:8080/getUserInfo", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setIsLoggedIn(false);
        throw new Error("Failed to fetch user info");
      }

      const responseBody = await response.json(); // { exp, username, userType }
      const csrfTokenHeader = response.headers.get("csrf_token");

      if (csrfTokenHeader && responseBody.exp) {
        setCsrfToken(csrfTokenHeader);
        setExpiryDate(new Date(responseBody.exp));
        setUsername(responseBody.username);
        setUserType(responseBody.userType);
        setIsLoggedIn(true);

        fetchDefaults.headers["csrf_token"] = csrfTokenHeader; // Store CSRF token globally
      } else {
        throw new Error("CSRF token or necessary fields missing in response");
      }
    } catch (error) {
      console.error("Failed to retrieve user info:", error);
    }
  };

  const register = async (
    userEmail: string,
    userPassword: string,
    userType: string,
    body: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/${
          userType === "customer"
            ? "customerRegistration"
            : "charityRegistration"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.message);
        throw new Error("Failed to log in");
      }

      await logIn(userEmail, userPassword);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Log in function
  const logIn = async (
    userEmail: string,
    userPassword: string
  ): Promise<void> => {
    try {
      const response = await fetch("http://127.0.0.1:8080/signIn", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail, userPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to log in");
      }

      const csrfTokenHeader = response.headers.get("csrf_token");

      if (csrfTokenHeader) {
        setCsrfToken(csrfTokenHeader);
        fetchDefaults.headers["csrf_token"] = csrfTokenHeader; // Store CSRF token globally if needed
      } else {
        throw new Error("CSRF token or expiry missing in the response");
      }

      await fetchUserInfo();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Log out function
  const signOut = async (): Promise<void> => {
    try {
      const response = await fetch("http://127.0.0.1:8080/signOut", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      setCsrfToken(null);
      setExpiryDate(null);
      setUsername(null);
      setUserType(null);
      setIsLoggedIn(false);

      delete fetchDefaults.headers["csrf_token"]; // Remove global CSRF token if used

      if (response.ok) {
        console.log("Logged out successfully");
      }
    } catch (error) {
      console.error("Logging out error:", error);
    }
  };

  // Check session validity on app load or expiryDate changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (expiryDate && new Date() > expiryDate) {
        setIsLoggedIn(false);
        setCsrfToken(null);
        setExpiryDate(null);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [expiryDate]);

  useEffect(() => {
    fetchUserInfo().catch((error) => {
      console.error("Failed to fetch user info on load:", error);
    });
  }, [location]); // Trigger on location (URL) changes

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        logIn,
        register,
        signOut,
        getCsrfToken,
        getUsername,
        getUserType,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = (): UserContextType => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Global fetch defaults for CSRF token management
const fetchDefaults = {
  headers: {} as Record<string, string>,
};

const customFetch = (url: string, options: RequestInit = {}) => {
  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...fetchDefaults.headers,
      ...options.headers,
    },
  };

  return fetch(url, mergedOptions);
};
