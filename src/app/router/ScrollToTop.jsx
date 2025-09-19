// src/app/router/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * 경로가 바뀔 때마다 스크롤을 맨 위로 올려주는 컴포넌트.
 * - 기본 window 스크롤
 * - 레이아웃이 별도 스크롤 컨테이너(.content 등)를 쓰는 경우도 대비
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // 1) window 자체 스크롤
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    // 2) 레이아웃 내부 스크롤 컨테이너도 함께 처리 (있을 때만)
    const candidates = [
      ".content",
      "[data-scroll-container]",
      "main",
      "#root",
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el && el.scrollTo) {
        try {
          el.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          el.scrollTop = 0; // smooth 미지원 대비
        }
        break; // 첫 번째 매칭만 처리
      }
    }
  }, [pathname, search, hash]);

  return null;
}
