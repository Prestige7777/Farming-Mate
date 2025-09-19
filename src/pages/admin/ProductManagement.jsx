// src/pages/admin/ProductManagement.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, getAllStories, updateProduct, updateStory } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EditProductModal from '../../components/marketplace/EditProductModal';
import EditStoryModal from '../../components/story/EditStoryModal';
import './ProductManagement.css';

export default function ProductManagement() {
  const [allProducts, setAllProducts] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [products, stories] = await Promise.all([
          getAllProducts(),
          getAllStories(),
        ]);
        setAllProducts(products);
        setAllStories(stories);
      } catch (error) {
        console.error("Failed to fetch product and story management data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct.id, updatedProduct);
      setAllProducts(allProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      alert('상품 정보가 성공적으로 업데이트되었습니다.');
      handleCloseProductModal();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert('상품 정보 업데이트에 실패했습니다.');
    }
  };

  const handleOpenStoryModal = (story) => {
    setSelectedStory(story);
    setIsStoryModalOpen(true);
  };

  const handleCloseStoryModal = () => {
    setIsStoryModalOpen(false);
    setSelectedStory(null);
  };

  const handleSaveStory = async (updatedStory) => {
    try {
      // Assuming updateStory API exists and works similarly to updateProduct
      // You might need to implement updateStory in your api.js if not already present
      await updateStory(updatedStory.id, updatedStory); // Using updateProduct as a placeholder
      setAllStories(allStories.map(s => s.id === updatedStory.id ? updatedStory : s));
      alert('재배일지 정보가 성공적으로 업데이트되었습니다.');
      handleCloseStoryModal();
    } catch (error) {
      console.error("Failed to update story:", error);
      alert('재배일지 정보 업데이트에 실패했습니다.');
    }
  };

  const handleToggleFeatured = async (product) => {
    const updatedProduct = { ...product, isFeatured: !product.isFeatured };
    setAllProducts(allProducts.map(p => p.id === product.id ? updatedProduct : p));

    try {
      await updateProduct(product.id, { isFeatured: updatedProduct.isFeatured });
    } catch (error) {
      console.error("Failed to update product:", error);
      setAllProducts(allProducts.map(p => p.id === product.id ? product : p));
      alert('상품 추천 상태 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-dashboard-page product-management">
      <main className="admin-dashboard-main">
        <h1 className="page-title">🛍️ 상품 및 재배일지 관리</h1>
        <p className="page-subtitle">판매자가 등록한 상품과 사용자가 작성한 재배일지를 검수/관리합니다.</p>

        <div className="tab-controls">
          <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>상품 검수</button>
          <button className={`tab-btn ${activeTab === 'stories' ? 'active' : ''}`} onClick={() => setActiveTab('stories')}>재배일지 관리</button>
        </div>

        {activeTab === 'products' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>상품 ID</th>
                  <th>상품명</th>
                  <th>판매자</th>
                  <th>가격</th>
                  <th>추천</th>
                  <th>상태</th>
                  <th>액션</th>
                  <th>상세</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td><Link to={`/farmers/${p.farmerId}/public`}>{p.farmerName}</Link></td>
                    <td>{p.price.toLocaleString()}원</td>
                    <td>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={p.isFeatured || false}
                          onChange={() => handleToggleFeatured(p)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                    <td>승인됨</td>
                    <td>
                      <button className="table-btn">반려</button>
                      <button className="table-btn">숨김</button>
                    </td>
                    <td>
                      <button className="table-btn" onClick={() => handleOpenProductModal(p)}>상세</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <EditProductModal
          isOpen={isProductModalOpen}
          onClose={handleCloseProductModal}
          product={selectedProduct}
          onSave={handleSaveProduct}
        />

        {activeTab === 'stories' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>게시물 ID</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                  <th>상태</th>
                  <th>액션</th>
                  <th>상세</th>
                </tr>
              </thead>
              <tbody>
                {allStories.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.title}</td>
                    <td>{s.farmerName}</td>
                    <td>{new Date(s.date).toLocaleDateString()}</td>
                    <td>활성</td>
                    <td>
                      <button className="table-btn danger">삭제</button>
                    </td>
                    <td>
                      <button className="table-btn" onClick={() => handleOpenStoryModal(s)}>상세</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isStoryModalOpen && (
          <EditStoryModal
            story={selectedStory}
            onClose={handleCloseStoryModal}
            onSave={handleSaveStory}
          />
        )}
      </main>
    </div>
  );
}