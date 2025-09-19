// src/components/farmer/FarmerProfile.jsx

import React from 'react';
import './FarmerProfile.css';

const FarmerProfile = ({ farmer, isOwner }) => {
  return (
    <div className="farmer-profile">
      <img
        src={farmer.profileImageUrl || 'https://placehold.co/150x150/e0e0e0/333?text=Farmer'}
        alt={`${farmer.name} 프로필`}
        className="profile-image"
      />
      <div className="profile-info">
        <h1 className="profile-title">
          {farmer.name} 농부님
          {farmer.isVerified && (
            <span className="badge verified-badge">인증 농부</span>
          )}
          {farmer.hasSmartFarm && (
            <span className="badge smart-farm-badge">스마트팜</span>
          )}
        </h1>
        <p className="profile-bio">{farmer.bio}</p>
        <p className="profile-location">위치: {farmer.location || farmer.address}</p>
      </div>
      {!isOwner && (
        <div className="follow-action">
          <button className="follow-button">+ 팔로우</button>
        </div>
      )}
    </div>
  );
};

export default FarmerProfile;