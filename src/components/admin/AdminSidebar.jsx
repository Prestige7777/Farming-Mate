// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom'; // Link 임포트
import { useAuth } from '../auth/AuthProvider';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        {/* 로고를 / 경로로 이동하는 Link로 변경 */}
        <Link to="/" className="admin-sidebar-logo">
          <span className="logo-icon">🚜</span>
          <span>Farming Mate</span>
        </Link>
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin" end className="admin-nav-item">
          <span className="admin-nav-icon">📊</span>
          <span>대시보드</span>
        </NavLink>
        <NavLink to="/admin/users" className="admin-nav-item">
          <span className="admin-nav-icon">👤</span>
          <span>사용자 관리</span>
        </NavLink>
        <NavLink to="/admin/products" className="admin-nav-item">
          <span className="admin-nav-icon">🛍️</span>
          <span>상품/게시물</span>
        </NavLink>
        <NavLink to="/admin/verifications" className="admin-nav-item">
          <span className="admin-nav-icon">✅</span>
          <span>판매자 인증</span>
        </NavLink>
        <NavLink to="/admin/content" className="admin-nav-item">
          <span className="admin-nav-icon">🌟</span>
          <span>추천/노출</span>
        </NavLink>
        <NavLink to="/admin/reports" className="admin-nav-item">
          <span className="admin-nav-icon">🚩</span>
          <span>문제 신고 관리</span>
        </NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="user-info">
          <span>Logged in as: <strong>{user?.name}</strong></span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          로그아웃
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
