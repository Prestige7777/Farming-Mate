// src/pages/SettingsPage.jsx
import React from 'react';
import './SettingsPage.css';

export default function SettingsPage() {
  return (
    <div className="settings-page">
      <h1>설정</h1>
      <div className="settings-section">
        <h2>디스플레이</h2>
        <div className="setting-item">
          <label htmlFor="font-size">글씨 크기</label>
          <select id="font-size">
            <option>보통</option>
            <option>크게</option>
            <option>아주 크게</option>
          </select>
        </div>
      </div>
      <div className="settings-section">
        <h2>알림</h2>
        <div className="setting-item">
          <span>푸시 알림</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="setting-item">
          <span>마케팅 정보 수신 동의</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      <div className="settings-section">
        <h2>계정</h2>
        <button className="settings-button">로그아웃</button>
        <button className="settings-button danger">회원 탈퇴</button>
      </div>
    </div>
  );
}
