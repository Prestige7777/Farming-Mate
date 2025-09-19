// src/pages/ProfilePage.jsx
import React from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-left">
            <div className="profile-avatar">
              <img
                src={user?.profileImageUrl || 'https://placehold.co/160x160/e0e0e0/333?text=User'}
                alt={`${user?.name || '사용자'} 프로필 이미지`}
              />
            </div>
          </div>
          <div className="profile-right">
            <h1 className="profile-title">{user?.name || '사용자'} 프로필</h1>
            <p className="profile-sub">쓴 글 / 팔로우 / 팔로잉 (임시)</p>

            <div className="profile-meta">
              <div><strong>이메일</strong> <span>{user?.email || '알 수 없음'}</span></div>
              <div><strong>역할</strong> <span>{user?.role || 'consumer'}</span></div>
              <div><strong>회원 ID</strong> <span>{user?.id}</span></div>
            </div>

            <div className="profile-actions">
              <button className="profile-btn">프로필 편집(예정)</button>
              <button className="profile-btn profile-btn-muted">설정(예정)</button>
            </div>
          </div>
        </div>

        <section className="profile-section">
          <h2 className="section-title">최근 활동 (임시)</h2>
          <div className="placeholder-box">여기에 글/스토리/리뷰 등이 표시됩니다.</div>
        </section>
      </main>
    </div>
  );
}