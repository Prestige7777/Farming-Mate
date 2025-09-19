// src/components/common/Sidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './Sidebar.css';
import logoImage from '../../assets/icons/Pasted Graphic.png'; // 로고 이미지 import

// 로고 전체를 Link로 감싸 메인(/)으로 이동
function Logo() {
  return (
    <Link to="/" className="sb-logo" aria-label="메인으로 이동">
      <img src={logoImage} alt="파밍메이트 로고" className="sb-logo-img" />
    </Link>
  );
}

export default function Sidebar({ open }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 더보기 팝오버 열림/닫힘 상태
  const [moreOpen, setMoreOpen] = useState(false);
  const popRef = useRef(null);

  // 바깥 클릭/ESC로 닫기
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e) => { if (e.key === 'Escape') setMoreOpen(false); };
    const onClick = (e) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target)) {
        if (!(e.target.closest && e.target.closest('.sb-more-btn'))) {
          setMoreOpen(false);
        }
      }
    };
    document.addEventListener('keydown', onDown);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onDown);
      document.removeEventListener('mousedown', onClick);
    };
  }, [moreOpen]);

  const handleProfileClick = () => {
    if (user) {
      navigate('/mypage');
    }
  };

  return (
    <aside
      className={`sidebar ${open ? 'open' : 'closed'}`}
      data-open={open ? 'true' : 'false'}
      aria-expanded={open ? 'true' : 'false'}
    >
      <div className="sb-inner">
        <Logo />

        {/* ───── 구분선 (프로필 위) ───── */}
        <div className="sb-hr" aria-hidden="true" />

        {/* 인증/프로필 영역 */}
        {user ? (
          <div
            onClick={handleProfileClick}
            className="sb-profile-new"
            title="마이페이지로 이동"
            style={{ cursor: 'pointer' }}
          >
            <div className="sb-avatar" title={user.name}>
              <img
                src={user.profileImageUrl || 'https://placehold.co/160x160/e0e0e0/333?text=User'}
                alt={`${user.name}의 프로필 사진`}
              />
            </div>
            <div className="sb-profile-meta">
              <div className="sb-profile-name">
                {user.name || '게스트'}
              </div>
              <div className="sb-profile-sub">내 정보 및 활동</div>
            </div>
          </div>
        ) : (
          // 로그인 전: 로그인/회원가입 CTA
          <div className="sb-auth-ctas">
            <Link to="/login" className="sb-auth-btn" title="로그인">
              <span className="sb-auth-btn-ico">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 1C9.24 1 7 3.24 7 6v3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2h-1V6c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v3H9V6c0-1.66 1.34-3 3-3zm-5 8h10v10H7V11z" />
                </svg>
              </span>
              <span className="sb-auth-btn-text">로그인</span>
            </Link>
            <Link to="/signup" className="sb-auth-btn sb-auth-btn-secondary" title="회원가입">
              <span className="sb-auth-btn-ico">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </span>
              <span className="sb-auth-btn-text">회원가입</span>
            </Link>
          </div>
        )}

        {/* ───── 구분선 (프로필 아래) ───── */}
        <div className="sb-hr" aria-hidden="true" />

        {/* 메뉴 */}
        <nav className="sb-nav">
          <Link className="sb-item" to="/search" onClick={(e) => { e.preventDefault(); alert('기능 준비 중입니다.'); }}>
            <span className="sb-ico">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </span>
            <span className="sb-label">검색</span>
          </Link>

          <Link className="sb-item" to="/messages" onClick={(e) => { e.preventDefault(); alert('기능 준비 중입니다.'); }}>
            <span className="sb-ico">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </span>
            <span className="sb-label">메시지</span>
          </Link>

          {user && (
            <Link className="sb-item" to="/wishlist">
              <span className="sb-ico">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
              <span className="sb-label">관심 상품</span>
            </Link>
          )}

          {user && user.role !== 'admin' && (
            <Link className="sb-item" to="/cart">
              <span className="sb-ico">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.7-17.5L3 5.5V14h14V5.5L12.3 0.5H8.3zM6 12V7h10v5H6z" />
                </svg>
              </span>
              <span className="sb-label">장바구니</span>
            </Link>
          )}

          <Link className="sb-item" to="/purchasesales">
            <span className="sb-ico">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-9H9V7h6v2z" />
              </svg>
            </span>
            <span className="sb-label">거래내역</span>
          </Link>

          <Link className="sb-item" to="/mynews">
            <span className="sb-ico">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 10h9v2H5zm0 4h9v2H5zm11-4h2v6h-2z" />
              </svg>
            </span>
            <span className="sb-label">내소식</span>
          </Link>


          {/* 관리자 메뉴 (관리자만 보이도록) */}
          {user && user.role === 'admin' && (
            <>
              <div className="sb-sep" />
              <Link className="sb-item" to="/admin">
                <span className="sb-ico">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.7 19l-2.05-2.05c-.45-.45-.7-.7-.7-1.06V14.5c0-.83-.67-1.5-1.5-1.5h-1.5c-.83 0-1.5.67-1.5 1.5v.5c0 .36-.25.61-.7.7L14.3 19c-.45.45-.7.7-.7 1.06V22c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.94c0-.36-.25-.61-.7-.7zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                </span>
                <span className="sb-label">관리자</span>
              </Link>
            </>
          )}

          <div className="sb-grow" />

          {/* 더보기(팝오버) */}
          <div className="sb-more-wrapper">
            <button
              type="button"
              className="sb-item sb-more-btn"
              aria-haspopup="menu"
              aria-expanded={moreOpen ? 'true' : 'false'}
              onClick={() => setMoreOpen(o => !o)}
              title="더보기"
            >
              <span className="sb-ico">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </span>
              <span className="sb-label sb-more-label">더 보기</span>
            </button>

            {moreOpen && (
              <div
                ref={popRef}
                className="sb-more-pop"
                role="menu"
                aria-label="더보기 메뉴"
              >
                <button
                  className="sb-pop-item"
                  role="menuitem"
                  type="button"
                  onClick={() => { setMoreOpen(false); navigate('/settings'); }}
                >
                  <span className="sb-pop-ico">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.39-1.09-.73-1.71-.98L14.82 2.8c-.06-.23-.28-.4-.5-.4h-4c-.22 0-.44.17-.5.4L9.21 5.93c-.62.25-1.19.59-1.71.98l-2.49-1c-.22-.08-.45 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.39 1.09.73 1.71.98l.37 3.03c.06.23.28.4.5.4h4c.22 0 .44-.17.5-.4l.37-3.03c.62-.25 1.19-.59 1.71-.98l2.49 1c.22.08.45 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-7.43 1.98c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                    </svg>
                  </span>
                  <span className="sb-pop-label">설정</span>
                </button>

                <button
                  className="sb-pop-item"
                  role="menuitem"
                  type="button"
                  onClick={() => alert('기능 준비 중입니다.')}
                >
                  <span className="sb-pop-ico">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.27-.59-.42-.91-.42-1.02 0-1.85-.83-1.85-1.85 0-.47.19-.9.49-1.21.3-.31.73-.49 1.21-.49 1.02 0 1.85-.83 1.85-1.85 0-.47-.19-.9-.49-1.21-.3-.31-.73-.49-1.21-.49-1.02 0-1.85-.83-1.85-1.85 0-.47.19-.9.49-1.21.3-.31.73-.49 1.21-.49C16.16 5.92 19 8.98 19 12c0 3.86-3.14 7-7 7V3z" />
                    </svg>
                  </span>
                  <span className="sb-pop-label">모드 전환</span>
                </button>

                <button
                  className="sb-pop-item"
                  role="menuitem"
                  type="button"
                  onClick={() => { setMoreOpen(false); navigate('/report-problem'); }}
                >
                  <span className="sb-pop-ico">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
                    </svg>
                  </span>
                  <span className="sb-pop-label">문제 신고</span>
                </button>

                {user && (
                  <>
                    <div className="sb-pop-divider" />
                    <button
                      className="sb-pop-item sb-pop-danger"
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setMoreOpen(false);
                        logout();
                        navigate('/login');
                      }}
                    >
                      <span className="sb-pop-ico">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                      </span>
                      <span className="sb-pop-label">로그아웃</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
}