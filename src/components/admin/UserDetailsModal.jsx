import React, { useState, useEffect } from 'react';
import { DEFAULT_IMAGE_URL } from '../../utils/constants';
import Modal from '../common/Modal';
import './UserDetailsModal.css'; // We will create this CSS file

const UserDetailsModal = ({ user, products, onClose, onSave }) => {
  const [editableUserData, setEditableUserData] = useState({});

  useEffect(() => {
    if (user) {
      setEditableUserData(user);
    }
  }, [user]);

  if (!user) return null;

  const handleFieldChange = (key, value) => {
    setEditableUserData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onSave(editableUserData);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="사용자 상세 정보 및 수정">
      <div className="user-details-content">
        <div className="user-info-display">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>이름:</strong> {user.name}</p>
          <p><strong>이메일:</strong> {user.email}</p>
          <p><strong>역할:</strong> {user.role}</p>
          <p><strong>인증 여부:</strong> {user.isVerified ? '예' : '아니오'}</p>
          {user.bio && <p><strong>소개:</strong> {user.bio}</p>}
        </div>

        <div className="json-editor-section">
          <h3>데이터 필드 수정</h3>
          {Object.keys(editableUserData).map(key => {
            const value = editableUserData[key];
            const isEditable = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

            return (
              <div className="form-group" key={key}>
                <label htmlFor={key}>{key}:</label>
                {isEditable ? (
                  <input
                    type={typeof value === 'number' ? 'number' : 'text'}
                    id={key}
                    name={key}
                    value={value !== null && value !== undefined ? value.toString() : ''}
                    onChange={(e) => handleFieldChange(key, typeof value === 'number' ? Number(e.target.value) : e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <textarea
                    id={key}
                    name={key}
                    value={JSON.stringify(value, null, 2)}
                    readOnly
                    disabled
                    className="form-control disabled-textarea"
                    rows="3"
                  ></textarea>
                )}
              </div>
            );
          })}
        </div>

        {user.role === 'farmer' && products && products.length > 0 && (
          <div className="farmer-products-section">
            <h3>판매 상품</h3>
            <ul className="product-list-modal">
              {products.map(product => (
                <li key={product.id} className="product-item-modal">
                  <img src={product.imageUrl || DEFAULT_IMAGE_URL} alt={product.name} className="product-image-modal" />
                  <div className="product-info-modal">
                    <h4>{product.name}</h4>
                    <p>{product.price.toLocaleString()}원</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {user.role === 'farmer' && (!products || products.length === 0) && (
          <p>등록된 상품이 없습니다.</p>
        )}
      </div>
      <div className="modal-actions">
        <button className="modal-button save-button" onClick={handleSave}>저장</button>
        <button className="modal-button cancel-button" onClick={onClose}>취소</button>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;