import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Khởi tạo state từ localStorage (giống hàm initAuth bên Vue)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setTokenState] = useState(() => localStorage.getItem('token'));

  // Hàm helper để lưu/xóa localStorage đồng bộ với State
  const setToken = (newToken) => {
    setTokenState(newToken);
    if (newToken) localStorage.setItem('token', newToken);
    else localStorage.removeItem('token');
  };

  const setUserData = (userData) => {
    setUser(userData);
    if (userData) localStorage.setItem('user', JSON.stringify(userData));
    else localStorage.removeItem('user');
  };

  // Logic Đăng nhập
  const login = async (credentials) => {
    try {
      const response = await userAPI.login(credentials);

      // Kiểm tra cấu trúc trả về giống file auth.js cũ
      if (response.success) {
        setToken(response.data.token);
        setUserData(response.data.user);
        return { success: true, message: response.message };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại'
      };
    }
  };

  // Logic Đăng ký
  const register = async (userData) => {
    try {
      const response = await userAPI.register(userData);

      if (response.success) {
        setToken(response.data.token);
        setUserData(response.data.user);
        return { success: true, message: response.message };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng ký thất bại'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
