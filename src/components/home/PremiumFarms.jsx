import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/premium.css";

/**
 * 프리미엄 농장 섹션
 * - 파메 인증(검증 배지) + 유료 멤버십 강조
 * - 카드: 커버 이미지 + 리본 + 인증 뱃지 + 농장명/지역 + 태그 + CTA
 * - 가로 스크롤 스냅(모바일) + 그리드(데스크탑)
 * - props.farms 로 실제 데이터 주입 가능. 없으면 mock 사용
 */

export default function PremiumFarms({ farms }) {
  const data = useMemo(() => {
    if (farms && farms.length) return farms;
    return [
      {
        id: "f1",
        name: "달빛과수원",
        region: "경북 문경",
        tier: "Gold",               // 유료 멤버십 등급
        verified: true,             // 파메 인증
        avatar: "",                 // 프로필 이미지 URL(비우면 기본 점)
        cover:
          "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1600&auto=format&fit=crop",
        tags: ["사과", "배", "제철과일"],
      },
      {
        id: "f2",
        name: "초록채소농장",
        region: "전남 나주",
        tier: "Silver",
        verified: true,
        avatar: "",
        cover:
          "https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1600&auto=format&fit=crop",
        tags: ["유기농", "채소", "무농약"],
      },
      {
        id: "f3",
        name: "섬귤팜",
        region: "제주 서귀포",
        tier: "Gold",
        verified: true,
        avatar: "",
        cover:
          "https://images.unsplash.com/photo-1517260739337-6799d9d86b86?q=80&w=1600&auto=format&fit=crop",
        tags: ["감귤", "천혜향"],
      },
      {
        id: "f4",
        name: "해뜰곡창",
        region: "충북 청주",
        tier: "Standard",
        verified: true,
        avatar: "",
        cover:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
        tags: ["잡곡", "현미", "귀리"],
      },
      {
        id: "f5",
        name: "산들버섯",
        region: "강원 홍천",
        tier: "Gold",
        verified: true,
        avatar: "",
        cover:
          "https://images.unsplash.com/photo-1504704911898-68304a7d2807?q=80&w=1600&auto=format&fit=crop",
        tags: ["표고", "버섯", "건조품"],
      },
      {
        id: "f6",
        name: "복숭아정원",
        region: "경남 함안",
        tier: "Silver",
        verified: true,
        avatar: "",
        cover:
          "https://images.unsplash.com/photo-1536514498073-50e69d39c6ab?q=80&w=1600&auto=format&fit=crop",
        tags: ["복숭아", "가공청"],
      },
    ];
  }, [farms]);

  return (
    <section className="pf">
      <div className="pf__head">
        <div>
          <h2 className="pf__title">프리미엄 농장</h2>
          <p className="pf__desc">
            파메 인증을 통과하고 유료 멤버십에 가입한 농장을 만나보세요.
            노출·프로모션을 통해 판매 성장을 함께 돕습니다.
          </p>
        </div>
        <Link to="/membership" className="pf__cta" aria-label="프리미엄 멤버십 안내">
          프리미엄 멤버십 안내
        </Link>
      </div>

      <div className="pf__list" role="list">
        {data.map((f) => (
          <article className="pf__card" key={f.id} role="listitem">
            {/* 커버 이미지 */}
            <div className="pf__cover">
              <img src={f.cover} alt={`${f.name} 농장`} />
              <span className={`pf__ribbon ${f.tier?.toLowerCase() || ""}`}>
                PREMIUM
              </span>

              {f.verified && (
                <span className="pf__badge" title="파메 인증">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 16.2l-3.5-3.6L4 14.1 9 19l11-11-1.5-1.5z" />
                  </svg>
                  파메 인증
                </span>
              )}
            </div>

            {/* 본문 */}
            <div className="pf__body">
              <header className="pf__profile">
                <span className="pf__avatar" aria-hidden="true">
                  {f.avatar ? <img src={f.avatar} alt="" /> : <span className="dot" />}
                </span>
                <div className="pf__meta">
                  <strong className="pf__name">{f.name}</strong>
                  <span className="pf__region">{f.region}</span>
                </div>
                <span className={`pf__tier ${f.tier?.toLowerCase() || ""}`}>
                  {f.tier || "Standard"}
                </span>
              </header>

              <ul className="pf__tags" aria-label="주요 품목">
                {f.tags?.slice(0, 3).map((t, i) => (
                  <li key={i} className="pf__tag">
                    {t}
                  </li>
                ))}
              </ul>

              <div className="pf__actions">
                <Link to={`/farmers/${f.id}`} className="btn pf__btn">
                  농장 보기
                </Link>
                <Link to={`/products?farmer=${f.id}`} className="btn btn--ghost pf__btn">
                  상품 보기
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 하단 안내 */}
      <div className="pf__foot">
        <span className="pf__footText">
          프리미엄 농장 신청을 원하시나요?
        </span>
        <Link to="/apply-premium" className="btn btn--primary pf__apply">
          프리미엄 신청
        </Link>
      </div>
    </section>
  );
}
