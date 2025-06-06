import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { Spin } from 'antd';

// Tạo context để chia sẻ thông tin user toàn app
const defaultUser = {
    displayName: '',
    photoURL: '',
    uid: '',
    email: ''

  }
export const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(defaultUser);        // Thông tin user đăng nhập
  const [isLoading, setIsLoading] = useState(true); // Đang kiểm tra đăng nhập
  const navigate = useNavigate();

  // Hàm logout đơn giản
  const logout = () => auth.signOut();

  useEffect(() => {
    // Theo dõi thay đổi trạng thái đăng nhập của Firebase
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Đã đăng nhập
        const { displayName, email, uid, photoURL } = user;
        setUser({ displayName, email, uid, photoURL });
        setIsLoading(false);

        if (window.location.pathname === '/login') {
          // Điều hướng async tránh lỗi concurrent rendering
          setTimeout(() => navigate('/'), 0);
        }
      } else {
        // Chưa đăng nhập
        setUser(defaultUser);
        setIsLoading(false);

        if (window.location.pathname !== '/login') {
          setTimeout(() => navigate('/login'), 0);
        }
      }
    });

    // Clean up listener khi component unmount
    return () => unsubscribe();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {isLoading ? (
        <Spin style={{ position: 'fixed', inset: 0 }} />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
