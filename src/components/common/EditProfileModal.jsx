// src/components/common/EditProfileModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import './EditProfileModal.css'; // We will create this CSS file next

const EditProfileModal = ({ isOpen, onClose, currentUser, onSave }) => {
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [profileBgUrl, setProfileBgUrl] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [bio, setBio] = useState('');

  const isFarmer = currentUser?.role === 'farmer';

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setFarmName(currentUser.farmName || '');
      setLocation(currentUser.location || '');
      setProfileBgUrl(currentUser.profileBgUrl || '');
      setProfileImageUrl(currentUser.profileImageUrl || '');
      setBio(currentUser.bio || '');
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { name, profileBgUrl, profileImageUrl, bio };
    if (isFarmer) {
      updatedData.farmName = farmName;
      updatedData.location = location;
    }
    onSave(updatedData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="프로필 편집">
      <form onSubmit={handleSubmit} className="edit-profile-form">
        {isFarmer && (
          <div className="form-group">
            <label htmlFor="farmName">농장 이름</label>
            <input
              type="text"
              id="farmName"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="농장 이름을 입력하세요"
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="name">{isFarmer ? '농부 이름' : '이름'}</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </div>
        {isFarmer && (
          <div className="form-group">
            <label htmlFor="location">농장 주소</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="농장 주소를 입력하세요"
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="profileBgUrl">배경 이미지 URL</label>
          <input
            type="text"
            id="profileBgUrl"
            value={profileBgUrl}
            onChange={(e) => setProfileBgUrl(e.target.value)}
            placeholder="배경 이미지 URL을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="profileImageUrl">프로필 사진 URL</label>
          <input
            type="text"
            id="profileImageUrl"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            placeholder="프로필 사진 URL을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">소개글</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자신을 소개해주세요"
            rows="4"
          ></textarea>
        </div>
        <div className="form-actions">
          <Button type="submit">저장</Button>
          <Button type="button" variant="secondary" onClick={onClose}>취소</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
