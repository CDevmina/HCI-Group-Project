import React, { useState, useEffect } from "react"; // createContext removed
import { AuthContext } from "./authContextInstance"; // Import AuthContext
import bcrypt from "bcryptjs";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial load

  useEffect(() => {
    // Check localStorage for a logged-in user when the app loads
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);

    if (user && bcrypt.compareSync(password, user.password)) {
      // Compare hashed password
      const userData = {
        email: user.email,
        fullName: user.fullName,
        id: user.id,
        // You can add other non-sensitive user details here if needed
      };
      localStorage.setItem("currentUser", JSON.stringify(userData));
      setCurrentUser(userData);
      return true;
    }
    return false;
  };

  const register = (fullName, email, password) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email === email)) {
      return {
        success: false,
        message: "User already exists with this email.",
      };
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password

    const newUser = {
      id: `user_${Date.now()}`,
      fullName,
      email,
      password: hashedPassword, // Store the hashed password
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    const userData = {
      email: newUser.email,
      fullName: newUser.fullName,
      id: newUser.id,
    };
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentUser(userData);
    return { success: true, user: userData };
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading, // expose loading state
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
