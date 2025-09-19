// src/pages/admin/ContentManagement.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <--- 이 줄이 추가되었습니다!
import { getAllFarmers, getAllProducts, getAllStories, updateStory } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { DEFAULT_IMAGE_URL } from '../../utils/constants';
import './ContentManagement.css';

export default function ContentManagement() {
  const [allFarmers, setAllFarmers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for recommended items (initially empty, will be populated after data fetch)
  const [recommendedFarmers, setRecommendedFarmers] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendedStories, setRecommendedStories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [farmers, products, stories] = await Promise.all([
          getAllFarmers(),
          getAllProducts(),
          getAllStories(),
        ]);
        setAllFarmers(farmers);
        setAllProducts(products);
        setAllStories(stories);

        // Populate recommended states with initial data (e.g., first 3 items)
        setRecommendedFarmers(farmers.slice(0, 3));
        setRecommendedProducts(products.slice(0, 3));
        setRecommendedStories(stories.filter(s => s.isRecommended));

      } catch (error) {
        console.error("Failed to fetch content management data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReorder = (type, items) => {
    console.log(`순서 변경: ${type}`, items.map(item => item.name || item.title));
    alert(`${type} 순서가 변경되었습니다. (콘솔 확인)`);
    // 실제로는 DB 업데이트 API 호출
  };

  const handleToggleRecommended = async (story) => {
    const updatedStory = { ...story, isRecommended: !story.isRecommended };
    try {
      await updateStory(story.id, { isRecommended: updatedStory.isRecommended });
      setAllStories(prevStories => prevStories.map(s => s.id === story.id ? updatedStory : s));
      setRecommendedStories(prevRecommended => {
        if (updatedStory.isRecommended) {
          return [...prevRecommended, updatedStory];
        } else {
          return prevRecommended.filter(s => s.id !== story.id);
        }
      });
    } catch (error) {
      console.error("Failed to update story recommendation status:", error);
      alert('재배일지 추천 상태 변경에 실패했습니다.');
    }
  };

  const handleReorderStories = (storyId, direction) => {
    setRecommendedStories(prevStories => {
      const index = prevStories.findIndex(s => s.id === storyId);
      if (index === -1) return prevStories;

      const newStories = [...prevStories];
      const [movedStory] = newStories.splice(index, 1);

      if (direction === 'up' && index > 0) {
        newStories.splice(index - 1, 0, movedStory);
      } else if (direction === 'down' && index < newStories.length - 1) {
        newStories.splice(index + 1, 0, movedStory);
      }
      // TODO: API call to save the new order
      console.log("New recommended stories order:", newStories.map(s => s.title));
      return newStories;
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-dashboard-page content-management">
      <main className="admin-dashboard-main">
        <h1 className="page-title">🌟 추천 및 노출 관리</h1>
        <p className="page-subtitle">홈페이지에 노출될 추천 콘텐츠를 직접 관리하고 순서를 변경합니다.</p>

        <section className="admin-section">
          <h2 className="section-title">화제의 농부</h2>
          <div className="reorder-list">
            {recommendedFarmers.map(farmer => (
              <Link to={`/farmers/${farmer.id}/public`} key={farmer.id} className="reorder-item">
                <img src={farmer.profileImageUrl || DEFAULT_IMAGE_URL} alt={farmer.name} className="reorder-item-img" />
                <span className="reorder-item-title">{farmer.name}</span>
              </Link>
            ))}
          </div>
          <button className="action-button" onClick={() => handleReorder('화제의 농부', recommendedFarmers)}>순서 변경(더미)</button>
        </section>

        <section className="admin-section">
          <h2 className="section-title">인기 상품</h2>
          <div className="reorder-list">
            {recommendedProducts.map(product => (
              <div key={product.id} className="reorder-item">
                <img src={product.imageUrl || DEFAULT_IMAGE_URL} alt={product.name} className="reorder-item-img" />
                <span className="reorder-item-title">{product.name}</span>
              </div>
            ))}
          </div>
          <button className="action-button" onClick={() => handleReorder('인기 상품', recommendedProducts)}>순서 변경(더미)</button>
        </section>

        <section className="admin-section">
          <h2 className="section-title">인기 재배일지</h2>
          <div className="reorder-list">
            {recommendedStories.map((story, index) => (
              <div key={story.id} className="reorder-item">
                <img src={(story.images && story.images[0]) || DEFAULT_IMAGE_URL} alt={story.title} className="reorder-item-img" />
                <span className="reorder-item-title">{story.title}</span>
                <div className="reorder-controls">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={story.isRecommended || false}
                      onChange={() => handleToggleRecommended(story)}
                    />
                    <span className="slider"></span>
                  </label>
                  <button onClick={() => handleReorderStories(story.id, 'up')} disabled={index === 0}>▲</button>
                  <button onClick={() => handleReorderStories(story.id, 'down')} disabled={index === recommendedStories.length - 1}>▼</button>
                </div>
              </div>
            ))}
          </div>
          {/* The reorder button below is now redundant as reordering is handled by individual story controls */}
          {/* <button className="action-button" onClick={() => handleReorder('인기 재배일지', recommendedStories)}>순서 변경(더미)</button> */}
        </section>
      </main>
    </div>
  );
}