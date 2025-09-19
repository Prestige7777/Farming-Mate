import React, { useMemo } from "react";
import "./reviews-marquee.css"; // 간단한 marquee CSS (아래 주석 참고)

const REVIEWS = [
  { id: "r3", user: "최**", product: "방울토마토 3kg", stars: 4, photo: false, text: "신선했고, 포장도 깔끔. 약간 단단한 편이었어요." },
  { id: "r4", user: "이**", product: "유기농 채소 구독", stars: 5, photo: false, text: "매주 다양한 구성이라 식단 짤 맛이 나네요." },
  { id: "r5", user: "정**", product: "딸기 2kg", stars: 5, photo: true, text: "포토 리뷰 올렸어요! 아이가 너무 좋아합니다 :)" },
  { id: "r6", user: "한**", product: "배 10과", stars: 4, photo: false, text: "아삭하고 달아요. 조금 작은 과도 있었지만 만족!" },
  { id: "r7", user: "오**", product: "프리미엄 셋트", stars: 5, photo: true, text: "선물했는데 너무 좋아하셨어요. 다음에도 구매!" },
];

export default function ReviewsEventPage() {
  const items = useMemo(() => [...REVIEWS, ...REVIEWS], []); // 무한 루프 느낌
  return (
    <main className="container" style={{ padding: "20px 16px", display: "grid", gap: 16 }}>
      <header>
        <h1 style={{ margin: 0 }}>리뷰 이벤트</h1>
        <p style={{ color: "#6b7280", marginTop: 6 }}>
          매달 베스트 리뷰어를 선정해 적립금을 드립니다. 포토 리뷰는 추가 적립!
        </p>
      </header>

      {REVIEWS.length === 0 ? (
        <section style={{ textAlign: "center", padding: "40px 20px", border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
          <p style={{ fontSize: "1.2em", color: "#6b7280" }}>아직 작성된 리뷰가 없습니다.</p>
          <p style={{ fontSize: "1.5em", fontWeight: "bold", color: "#333", margin: "10px 0" }}>리뷰 0개</p>
          <button
            onClick={() => alert("리뷰 작성 기능은 준비중입니다.")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f75d20cf",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1em",
              marginTop: "20px",
            }}
          >
            리뷰 작성하기
          </button>
        </section>
      ) : (
        /* 마퀴(가로 스크롤) */
        <section className="reviews-marquee">
          <div className="track">
            {items.map((r, idx) => (
              <article key={`${r.id}-${idx}`} className="card">
                <div className="stars" aria-label={`${r.stars}점`}>
                  {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
                </div>
                <p style={{ margin: "6px 0", fontWeight: 600 }}>{r.user} · {r.product}</p>
                <p style={{ margin: 0, color: "#374151" }}>{r.text}</p>
                {r.photo && <span className="tag">PHOTO</span>}
              </article>
            ))}
          </div>
        </section>
      )}

      <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, background: "#fff" }}>
        <h2 style={{ margin: "0 0 8px" }}>이벤트 안내</h2>
        <ul style={{ margin: "0 0 0 18px" }}>
          <li>베스트 리뷰어(매월 3명): <strong>30,000P</strong> 적립</li>
          <li>포토 리뷰: 기본 적립 + <strong>추가 1,000P</strong></li>
          <li>구매 인증 필수, 욕설/비방/광고성 글 제외</li>
        </ul>
      </section>
    </main>
  );
}

/* --- 참고 CSS: src/pages/reviews/reviews-marquee.css ---
.reviews-marquee { overflow: hidden; border-radius: 12px; border: 1px solid #eee; background: #fff; }
.reviews-marquee .track {
  display: inline-flex; gap: 12px; padding: 12px;
  animation: marquee 30s linear infinite;
  will-change: transform;
}
.reviews-marquee .card {
  min-width: 260px; max-width: 320px; border: 1px solid #eee; border-radius: 10px; padding: 12px; background: #fafafa; position: relative;
}
.reviews-marquee .card .tag {
  position: absolute; top: 10px; right: 10px; background: #111827; color: #fff; border-radius: 999px; padding: 2px 8px; font-size: 12px;
}
.reviews-marquee .stars { color: #f59e0b; }
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
*/
