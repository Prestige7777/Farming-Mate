// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import { getAllFarmers, getAllProducts, getAllUsers } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allFarmers, setAllFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [users, products, farmers] = await Promise.all([
          getAllUsers(),
          getAllProducts(),
          getAllFarmers(),
        ]);
        setAllUsers(users);
        setAllProducts(products);
        setAllFarmers(farmers);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingVerifications = allUsers.filter(user => user.role === 'consumer' && !user.isVerified);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-dashboard">
      <main className="admin-dashboard-main">
        <h1 className="page-title">📊 관리자 대시보드</h1>
        <p className="welcome-text">환영합니다, {user?.name}님. 사이트 현황을 관리하세요.</p>
        
        <div className="admin-widgets">
          <div className="widget-card">
            <h2 className="widget-title">총 회원 수</h2>
            <p className="widget-value">{allUsers.length}명</p>
          </div>
          <div className="widget-card">
            <h2 className="widget-title">총 상품 수</h2>
            <p className="widget-value">{allProducts.length}개</p>
          </div>
          <div className="widget-card">
            <h2 className="widget-title">인증 대기 농부</h2>
            <p className="widget-value">{pendingVerifications.length}명</p>
          </div>
        </div>

        

      </main>
    </div>
  );
}