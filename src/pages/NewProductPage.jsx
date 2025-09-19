// src/pages/NewProductPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import { createProduct } from '../utils/api';
import Button from '../components/common/Button';
import './NewContentForm.css';

const NewProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState(''); // Add state for tags
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    // Process tags string into an array
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const productData = {
      name,
      price: parseInt(price, 10),
      description,
      imageUrl,
      tags: tagsArray, // Add tags to product data
      farmerId: user.id,
      farmerName: user.name,
      isFeatured: false, // 기본값은 추천 아님
      createdAt: new Date().toISOString(),
    };

    try {
      await createProduct(productData);
      alert('상품이 성공적으로 등록되었습니다.');
      navigate('/mypage');
    } catch (err) {
      setError(err.message);
      console.error("Failed to create product:", err);
    }
  };

  return (
    <div className="form-page">
      <h1 className="form-page-title">새 상품 등록</h1>
      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-group">
          <label htmlFor="name">상품명</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="price">가격</label>
          <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">상품 이미지 URL</label>
          <input id="imageUrl" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" required />
        </div>
        <div className="form-group">
          <label htmlFor="description">상품 설명</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="6" required />
        </div>
        <div className="form-group">
          <label htmlFor="tags">태그</label>
          <input id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="쉼표(,)로 구분하여 입력하세요" />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={() => navigate('/mypage')}>취소</Button>
          <Button type="submit">등록하기</Button>
        </div>
      </form>
    </div>
  );
};

export default NewProductPage;
