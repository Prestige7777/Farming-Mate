import React, { useMemo } from "react";
import "./premium-marquee.css";

const CASES = [
  { id: "c1", farm: "청송애플팜", growth: "+38%", period: "6개월", note: "제철 패키지 구성과 리뷰 이벤트 연동", cover: "https://via.placeholder.com/960x540?text=Apple+Case" },
  { id: "c2", farm: "담양버섯원",  growth: "+21%", period: "3개월", note: "프리미엄 묶음 기획전/정기배송 연계", cover: "https://via.placeholder.com/960x540?text=Mushroom+Case" },
  { id: "c3", farm: "영동포도원",  growth: "+46%", period: "5개월", note: "공동구매 → 재구매 전환율 향상", cover: "https://via.placeholder.com/960x540?text=Grape+Case" },
];

const VOICES = [
  { id: "v1", farmer: "박OO", farm: "청송애플팜", quote: "기획전/리뷰 운영을 같이 설계해줘서 큰 도움이 됐어요.", avatar: "https://via.placeholder.com/80?text=A" },
  { id: "v2", farmer: "김OO", farm: "담양버섯원", quote: "프리미엄 전용 대시보드로 재고/수요 예측이 쉬워졌습니다.", avatar: "https://via.placeholder.com/80?text=B" },
  { id: "v3", farmer: "이OO", farm: "영동포도원", quote: "공동구매 이후 정기구독으로 이어지는 흐름이 생겼어요.", avatar: "https://via.placeholder.com/80?text=C" },
];

export default function PremiumPage() {
  const loopVoices = useMemo(() => [...VOICES, ...VOICES], []);
  return (
    <main className="container" style={{ padding: "20px 16px", display: "grid", gap: 18 }}>
      <header>
        <h1 style={{ margin: 0 }}>프리미엄 농가</h1>
        <p style={{ color: "#6b7280", marginTop: 6 }}>
          성장 사례와 실제 농부들의 목소리를 소개합니다. 운영/마케팅 지원을 통해 안정적인 판로와 재구매를 만들어가요.
        </p>
      </header>

      {/* 케이스 스터디 */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {CASES.map(cs => (
          <article key={cs.id} style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            <img src={cs.cover} alt={cs.farm} style={{ width: "100%", height: 160, objectFit: "cover" }} />
            <div style={{ padding: 12 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>{cs.farm}</h2>
              <p style={{ margin: 0, color: "#6b7280" }}>{cs.period} 매출 {cs.growth}</p>
              <p style={{ margin: "6px 0 0", color: "#374151" }}>{cs.note}</p>
            </div>
          </article>
        ))}
      </section>

      {/* 농부 후기 (가로 흐름) */}
      <section className="premium-marquee">
        <div className="track">
          {loopVoices.map((v, i) => (
            <figure key={`${v.id}-${i}`} className="voice">
              <img src={v.avatar} alt={v.farmer} width={48} height={48} />
              <figcaption>
                <strong>{v.farmer}</strong> · <span style={{ color: "#6b7280" }}>{v.farm}</span>
                <p style={{ margin: "6px 0 0" }}>&ldquo;{v.quote}&rdquo;</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 자연스러운 CTA */}
      <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, background: "#fff" }}>
        <h2 style={{ margin: "0 0 8px" }}>프리미엄 안내 받기</h2>
        <p style={{ margin: "0 0 10px", color: "#6b7280" }}>
          현재 거래량/품목/운영 방식에 맞춘 맞춤형 제안을 드립니다. 부담 없이 문의해 주세요.
        </p>
        <a className="btn btn--primary" href="mailto:partner@farm.example">간단 문의하기</a>
      </section>
    </main>
  );
}

/* --- CSS: src/pages/premium-marquee.css ---
.premium-marquee { overflow: hidden; border: 1px solid #eee; border-radius: 12px; background: #fff; }
.premium-marquee .track { display: inline-flex; gap: 16px; padding: 12px; animation: marquee 28s linear infinite; }
.premium-marquee .voice { display: inline-flex; align-items: center; gap: 10px; min-width: 320px; border: 1px solid #eee; border-radius: 10px; padding: 10px; background: #fafafa; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
*/
