// src/components/home/ProductSection.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Modal from '../common/Modal';


import "../../styles/home/products.css";

const SORT_OPTIONS = [
  { key: "recommend", label: "파메 추천순" },
  { key: "new", label: "신상품순" },
  { key: "price-desc", label: "가격 높은순" },
  { key: "price-asc", label: "가격 낮은순" },
];

export default function ProductSection({ products, pageSize = 4 }) {
  const [openFilter, setOpenFilter] = useState(false);
  const [sortKey, setSortKey] = useState("recommend");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [openProductOptionsId, setOpenProductOptionsId] = useState(null);
  
  

  const dataset = products || [];

  const sorted = useMemo(() => {
    const arr = [...dataset];
    switch (sortKey) {
      case "new":
        return arr.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      case "price-desc":
        return arr.sort((a, b) => b.price - a.price);
      case "price-asc":
        return arr.sort((a, b) => a.price - b.price);
      case "recommend":
      default:
        return arr;
    }
  }, [dataset, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  const goPrev = () => setPage((p) => (p > 1 ? p - 1 : totalPages));
  const goNext = () => setPage((p) => (p < totalPages ? p + 1 : 1));

  const onSelectSort = (key) => {
    setSortKey(key);
    setOpenFilter(false);
    setPage(1);
  };
  
  const handleProfileClick = (farmerId) => {
    if (user && user.id === farmerId) {
      navigate('/mypage');
    } else {
      navigate(`/farmers/${farmerId}/public`);
    }
  };

  if (!dataset.length) {
    return (
      <section className="ps">
        <h2 className="ps__title">추천 상품</h2>
        <p>현재 추천 상품이 없습니다.</p>
      </section>
    );
  }

  return (
    <>
    <section className="ps">
      <div className="ps__head">
        <h2 className="ps__title">추천 상품</h2>
        <div className="ps__filter">
          <button
            className="ps__filterBtn"
            aria-expanded={openFilter}
            aria-controls="ps-filter-panel"
            onClick={() => setOpenFilter((v) => !v)}
          >
            {SORT_OPTIONS.find(opt => opt.key === sortKey)?.label || '정렬 기준'}
            <span className={`ps__chev ${openFilter ? "up" : "down"}`} />
          </button>
          {openFilter && (
            <div
              id="ps-filter-panel"
              role="menu"
              className="ps__filterPanel"
            >
              <div className="ps__filterTitle">필터링 조건</div>
              <ul className="ps__filterList">
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt.key}>
                    <button
                      role="menuitemradio"
                      aria-checked={sortKey === opt.key}
                      className={`ps__filterItem ${
                        sortKey === opt.key ? "is-active" : ""
                      }`}
                      onClick={() => onSelectSort(opt.key)}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="ps__grid">
        {pageItems.map((p) => (
          <article className="ps__card" key={p.id}>
            <header className="ps__profile">
              <div className="ps__profile-left" onClick={() => handleProfileClick(p.farmerId)}>
                <span className="ps__avatar" aria-hidden="true">
                  <img src={p.farmerProfileImageUrl || 'https://placehold.co/40x40/e0e0e0/333?text=IMG'} alt={`${p.farmerName} 프로필 이미지`} />
                </span>
                <span className="ps__profileLabel">{p.farmName || '농장'}</span>
              </div>
              <div className="ps__options-button">
                <button onClick={() => setOpenProductOptionsId(openProductOptionsId === p.id ? null : p.id)}>...</button> {/* Three-dot button */}
                {openProductOptionsId === p.id && (
                  <div className="ps__options-panel">
                    <button className="ps__option-item">공유하기</button>
                    <button className="ps__option-item">신고하기</button>
                  </div>
                )}
              </div>
            </header>
            <div className="ps__photo" onClick={() => navigate(`/products/${p.id}`)}>
              <img src={p.imageUrl} alt={p.name} />
            </div>
            <div className="ps__info" onClick={() => navigate(`/products/${p.id}`)}>
              <h3 className="ps__name">{p.name}</h3>
              {p.tags && p.tags.length > 0 && (
                <div className="ps__tags">
                  {p.tags.map((tag, index) => (
                    <span key={index} className="ps__tag">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="ps__priceRow">
                <span className="ps__sale">
                  {Number(p.price).toLocaleString()} 원
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="ps__pager">
        <button
          className="ps__navBtn"
          aria-label="이전 페이지"
          onClick={goPrev}
        >
          ◀
        </button>
        <span className="ps__pageBadge">
          {safePage} / {totalPages}
        </span>
        <button
          className="ps__navBtn"
          aria-label="다음 페이지"
          onClick={goNext}
        >
          ▶
        </button>
      </div>
    </section>
     <Modal
      isOpen={showOptionsModal}
      onClose={() => setShowOptionsModal(false)}
      title="옵션"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button style={{ padding: '10px', border: '1px solid #eee', borderRadius: '5px', background: '#fff', cursor: 'pointer' }}>공유하기</button>
        <button style={{ padding: '10px', border: '1px solid #eee', borderRadius: '5px', background: '#fff', cursor: 'pointer' }}>신고하기</button>
      </div>
    </Modal>
    </>
  );
}