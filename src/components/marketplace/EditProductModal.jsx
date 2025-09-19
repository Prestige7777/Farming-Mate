// src/components/marketplace/EditProductModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import './EditProductModal.css';

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setPrice(product.price || '');
      setDescription(product.description || '');
      setImageUrl(product.imageUrl || '');
      setTags(product.tags ? product.tags.join(', ') : '');
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    onSave({
      ...product,
      name,
      price: parseInt(price, 10),
      description,
      imageUrl,
      tags: tagsArray,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="상품 수정">
      <form onSubmit={handleSubmit} className="edit-product-form">
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
          <label htmlFor="tags">태그 (쉼표로 구분)</label>
          <input id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="유기농, 친환경" />
        </div>
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>취소</Button>
          <Button type="submit">저장</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
