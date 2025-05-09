import React, { createContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';

const AuthContext = createContext(null);

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    const { fullName, email, password } = userData;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(user => user.email === email)) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || ''; // Handle cases with no last name

    // Base new user on the structure from Profile.jsx's USER mock
    const newUser = {
      id: Date.now().toString(), // Simple unique ID
      firstName,
      lastName,
      email,
      phone: "", // Initialize as empty or prompt user later
      company: "", // Initialize as empty or prompt user later
      role: "", // Initialize as empty or prompt user later
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`, // Placeholder avatar
      emailVerified: false, // Default to not verified
      twoFactorEnabled: false,
      language: "English",
      timezone: "Colombo/Sri Lanka", // Default or get from browser
      notifications: {
        email: {
          projectUpdates: true,
          teamActivity: false,
          newsAndTips: true,
          marketing: false,
        },
        app: {
          projectUpdates: true,
          teamActivity: true,
          newsAndTips: false,
        },
      },
      preferences: {
        theme: "light",
        defaultMeasurementUnit: "metric",
        autosaveInterval: 5,
        defaultView: "3d",
      },
      hashedPassword,
      // Add a field for room editor progress if needed
      roomEditorProgress: {},
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    // Optionally log in the user directly after registration
    // login(email, password); 
    return newUser;
  };

  const login = async (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (user && await bcrypt.compare(password, user.hashedPassword)) {
      const { _hashedPassword, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    throw new Error('Invalid email or password');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
