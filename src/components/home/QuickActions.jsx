import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home/quick-actions.css";

/**
 * 기능 버튼 행
 * - 아이콘(원형 배경) + 라벨
 * - 가운데 정렬, 줄바꿈 대응, 키보드 접근성/포커스 링
 * - 항목 증감은 actions 배열만 수정하면 됨
 */
export default function QuickActions() {
  const actions = [
    {
      key: "recommend",
      label: "파메 추천",
      to: "/recommend",
      // 임시 아이콘(SVG). 추후 교체 가능
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ),
      desc: "추천 상품 모아보기",
    },
    {
      key: "farming-log",
      label: "재배일지",
      to: "#popular-stories-section",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h12v16zM9 7h6v2H9zm0 4h6v2H9zm0 4h6v2H9z" />
        </svg>
      ),
      desc: "인기 재배일지 모아보기",
    },
    {
      key: "solo",
      label: "소포장",
      to: "/small-packaging",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
        </svg>
      ),
      desc: "소량 포장 상품",
    },
    {
      key: "organic",
      label: "유기농",
      to: "/organic",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.41 6.35c-.78-.78-2.05-.78-2.83 0L12 8.94l-2.58-2.59c-.78-.78-2.05-.78-2.83 0-.78.78-.78 2.05 0 2.83L9.17 12l-2.58 2.58c-.78.78-.78 2.05 0 2.83.78.78 2.05.78 2.83 0L12 15.06l2.58 2.59c.78.78 2.05.78 2.83 0 .78-.78.78-2.05 0-2.83L14.83 12l2.58-2.58c.78-.78.78-2.05 0-2.83z" />
        </svg>
      ),
      desc: "친환경/유기농",
    },
    {
      key: "eco-friendly",
      label: "친환경",
      to: "/eco-friendly",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      ),
      desc: "친환경 상품 모아보기",
    },
    {
      key: "experience",
      label: "농촌 체험",
      to: "#", // Change to #
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
      desc: "입점 농가 체험",
      onClick: () => alert("기능 준비중입니다"), // Add onClick handler
    },
    {
      key: "find-farm",
      label: "농장 찾기",
      to: "#", // Change to #
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
        </svg>
      ),
      desc: "농가 검색",
      onClick: () => alert("기능 준비중입니다"), // Add onClick handler
    },
    {
      key: "premium",
      label: "프리미엄",
      to: "/premium",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 1L2 12l10 11 10-11L12 1z" />
        </svg>
      ),
      desc: "프리미엄 농가 상품",
    },
  ];

  return (
    <nav className="qa" aria-label="빠른 기능">
      <ul className="qa__list">
        {actions.map((a) => (
          <li className="qa__item" key={a.key}>
            {a.key === "recommend" || a.key === "farming-log" ? (
              <a
                href={a.to}
                className="qa__btn"
                aria-label={`${a.label}: ${a.desc}`}
                onClick={(e) => {
                  e.preventDefault();
                  let targetId = '';
                  if (a.key === 'recommend') {
                    targetId = 'recommended-products';
                  } else if (a.key === 'farming-log') {
                    targetId = 'popular-stories-section';
                  }
                  document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="qa__icon" aria-hidden="true">{a.icon}</span>
                <span className="qa__label">{a.label}</span>
              </a>
            ) : a.onClick ? (
              <a
                href={a.to}
                className="qa__btn"
                aria-label={`${a.label}: ${a.desc}`}
                onClick={(e) => {
                  e.preventDefault();
                  a.onClick();
                }}
              >
                <span className="qa__icon" aria-hidden="true">{a.icon}</span>
                <span className="qa__label">{a.label}</span>
              </a>
            ) : (
              <Link to={a.to} className="qa__btn" aria-label={`${a.label}: ${a.desc}`}>
                <span className="qa__icon" aria-hidden="true">{a.icon}</span>
                <span className="qa__label">{a.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
