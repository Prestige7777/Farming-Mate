import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { updateStory } from '../../utils/api';
import './EditStoryModal.css';

const EditStoryModal = ({ story, onClose, onSave }) => {
  const [title, setTitle] = useState(story.title);
  const [content, setContent] = useState(story.content);
  const [images, setImages] = useState(story.images ? story.images.join('\n') : '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const imageUrls = images.split('\n').map(url => url.trim()).filter(url => url !== '');

    const updatedStoryData = {
      ...story,
      title,
      content,
      images: imageUrls,
    };

    try {
      await updateStory(story.id, updatedStoryData);
      alert('재배일지가 성공적으로 수정되었습니다.');
      onSave(updatedStoryData); // Pass updated data back to parent
      onClose();
    } catch (err) {
      setError(err.message || '스토리 수정에 실패했습니다.');
      console.error("Failed to update story:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="재배일지 수정">
      <form onSubmit={handleSubmit} className="edit-story-form">
        <div className="form-group">
          <label htmlFor="edit-title">제목</label>
          <input id="edit-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="edit-images">이미지 URL (각 줄에 하나씩)</label>
          <textarea id="edit-images" value={images} onChange={(e) => setImages(e.target.value)} placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg" rows="5" required />
        </div>
        <div className="form-group">
          <label htmlFor="edit-content">내용</label>
          <textarea id="edit-content" value={content} onChange={(e) => setContent(e.target.value)} rows="10" required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>취소</Button>
          <Button type="submit" disabled={loading}>{loading ? '수정 중...' : '수정하기'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditStoryModal;
