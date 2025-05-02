import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [chatbotuserLoggedIn, setChatbotUserLoggedIn] = useState(false);
    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);
    const loginChatbotUser = () => setChatbotUserLoggedIn(true);
    const logoutChatbotUser = () => setChatbotUserLoggedIn(false);
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, login, logout, chatbotuserLoggedIn, loginChatbotUser, logoutChatbotUser }}>
        {children}
      </AuthContext.Provider>
    );
  };

    export const useAuth = () => {
        return useContext(AuthContext);
    };