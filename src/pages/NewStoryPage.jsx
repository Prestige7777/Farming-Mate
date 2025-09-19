// src/pages/NewStoryPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import { createStory } from '../utils/api';
import Button from '../components/common/Button';
import './NewContentForm.css';

const NewStoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState(''); // Changed from imageUrl to images
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    const imageUrls = images.split('\n').map(url => url.trim()).filter(url => url !== '');

    const storyData = {
      title,
      content,
      images: imageUrls, // Changed from imageUrl to images
      farmerId: user.id,
      farmerName: user.name,
      likes: [],
      comments: [],
      date: new Date().toISOString(),
    };

    try {
      await createStory(storyData);
      alert('재배일지가 성공적으로 등록되었습니다.');
      navigate('/mypage');
    } catch (err) {
      setError(err.message);
      console.error("Failed to create story:", err);
    }
  };

  return (
    <div className="form-page">
      <h1 className="form-page-title">새 재배일지 작성</h1>
      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="images">이미지 URL (각 줄에 하나씩)</label>
          <textarea id="images" value={images} onChange={(e) => setImages(e.target.value)} placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg" rows="5" required />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="10" required />
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

export default NewStoryPage;
