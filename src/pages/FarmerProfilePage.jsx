// src/pages/FarmerProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FarmerProfile from '../components/farmer/FarmerProfile';
import FarmingDataGraph from '../components/farmer/FarmingDataGraph';
import { getFarmerById, getAllProducts, getAllStories } from '../utils/api';
import { useAuth } from '../components/auth/AuthProvider'; // Import useAuth
import LoadingSpinner from '../components/common/LoadingSpinner';
import './FarmerProfilePage.css';

const FarmerProfilePage = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [farmerStories, setFarmerStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth(); // Get authenticated user

  const isOwner = user && user.role === 'farmer' && user.id === id;

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        setLoading(true);
        const farmerData = await getFarmerById(id);
        setFarmer(farmerData);

        if (farmerData) {
          const allProducts = await getAllProducts();
          const products = allProducts.filter(p => p.farmerId === id);
          setFarmerProducts(products);

          const allStories = await getAllStories();
          const stories = allStories.filter(s => s.farmerId === id);
          setFarmerStories(stories);
        }
      } catch (error) {
        console.error("Failed to fetch farmer details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!farmer) {
    return (
      <div className="farmer-not-found">
        <h1 className="not-found-title">농부를 찾을 수 없습니다.</h1>
        <p className="not-found-text">존재하지 않는 농부 ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="farmer-profile-page">
      <main className="farmer-profile-main">
        {/* 프로필 컴포넌트 사용 */}
        <FarmerProfile farmer={farmer} isOwner={isOwner} />

        {/* 스마트팜 데이터 컴포넌트 사용 */}
        {farmer.hasSmartFarm && farmer.smartFarmData && (
          <section className="smart-farm-section">
            <h2 className="section-title">🌳 스마트팜 데이터</h2>
            <p className="section-subtitle">과학적인 방법으로 재배된 작물의 성장 환경을 확인하세요.</p>
            <FarmingDataGraph data={farmer.smartFarmData} />
          </section>
        )}

        {/* 판매 상품 섹션 */}
        <section className="products-section">
          <div className="section-header">
            <h2 className="section-title">🛍️ 판매 중인 상품</h2>
            {isOwner && (
              <button className="add-product-btn">상품 추가</button>
            )}
          </div>
          <div className="products-grid">
            {farmerProducts.length > 0 ? (
              farmerProducts.map(product => (
                <div key={product.id} className="product-item">
                  <img src={product.imageUrl || 'https://via.placeholder.com/100'} alt={product.name} className="product-item-image" />
                  <p className="product-item-name">{product.name}</p>
                  <p className="product-item-price">{product.price}원</p>
                </div>
              ))
            ) : (
              <p className="empty-message">현재 판매 중인 상품이 없습니다.</p>
            )}
          </div>
        </section>

        {/* 파밍스토리 섹션 */}
        <section className="stories-section">
          <h2 className="section-title">📸 파밍 스토리</h2>
          {isOwner && (
            <div className="story-add-container">
              <button className="add-story-btn">스토리 작성하기</button>
            </div>
          )}
          <div className="stories-grid">
            {farmerStories.length > 0 ? (
              farmerStories.map(story => (
                <div key={story.id} className="story-item">
                  <img src={story.imageUrl || 'https://via.placeholder.com/200x150'} alt={story.title} className="story-item-image" />
                  <p className="story-item-title">{story.title}</p>
                  <p className="story-item-date">{story.date}</p>
                </div>
              ))
            ) : (
              <p className="empty-message">아직 작성된 스토리가 없습니다.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FarmerProfilePage;
