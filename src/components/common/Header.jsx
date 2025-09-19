// src/components/common/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useCart } from '../../context/CartContext';
import Button from './Button'; // Button 컴포넌트 임포트
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { toggleCartSidebar } = useCart();

  return (
    <header className="header">
      <Link to="/" className="logo">
        파밍메이트
      </Link>
      <nav className="nav">
        <Link to="/products" className="nav-link">상품</Link>
        <Link to="/stories" className="nav-link">스토리</Link>
        <Link to="/farmers/1" className="nav-link">농부</Link> {/* 임시 farmerId */}
      </nav>
      <div className="auth-buttons">
        {user ? (
          <>
            <Link to="/mypage" className="nav-link">마이페이지</Link>
            <Button onClick={logout} variant="secondary" className="auth-btn">로그아웃</Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="secondary" className="auth-btn">로그인</Button>
            </Link>
            <Link to="/signup">
              <Button className="auth-btn">회원가입</Button>
            </Link>
          </>
        )}
        <Button onClick={toggleCartSidebar} className="auth-btn">장바구니</Button>
      </div>
    </header>
  );
};

export default Header;