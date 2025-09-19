// src/components/auth/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllUsers, createUser } from '../../utils/api'; // Import API functions

const AuthContext = createContext(null);

// 로컬스토리지 키
const LS_USER = 'auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // 기존 로그인 유지
      const rawUser = localStorage.getItem(LS_USER);
      if (rawUser) setUser(JSON.parse(rawUser));
    } catch (e) {
      console.warn('Auth init error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to update user in context and local storage
  const updateUserContext = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(LS_USER, JSON.stringify(updatedUser));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const users = await getAllUsers(); // Fetch users from json-server
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        updateUserContext(found);
        return { success: true, user: found };
      } else {
        return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
      }
    } catch (e) {
      console.error("Login error:", e);
      return { success: false, message: '로그인 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_USER);
  };

  const register = async ({ email, password, username }) => {
    setLoading(true);
    try {
      const users = await getAllUsers();
      if (users.some(u => u.email === email)) {
        return { success: false, message: '이미 존재하는 이메일입니다.' };
      } else {
        const newUser = {
          id: `u${Date.now()}`,
          email,
          password,
          name: username || '새 사용자',
          role: 'consumer',
          profileImageUrl: '',
          profileBgUrl: '',
          bio: '',
        };
        await createUser(newUser); // Create user via API
        return { success: true, message: '회원가입 성공! 로그인해주세요.' };
      }
    } catch (e) {
      console.error("Registration error:", e);
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
