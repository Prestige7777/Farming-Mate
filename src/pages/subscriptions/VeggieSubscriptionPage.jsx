import React from "react";
import { Link } from "react-router-dom";

const PLANS = [
  { id: "S", name: "스몰 박스",   items: "5~6종",  price: 17900, best: false, desc: "1~2인 가구 추천" },
  { id: "M", name: "미디엄 박스", items: "7~9종",  price: 24900, best: true,  desc: "가성비 최고, 가장 인기!" },
  { id: "L", name: "라지 박스",   items: "10~12종", price: 32900, best: false, desc: "가족 구성원 많은 집 추천" },
];

export default function VeggieSubscriptionPage() {
  return (
    <main className="container" style={{ padding: "20px 16px" }}>
      <h1 style={{ margin: 0 }}>친환경 채소 구독</h1>
      <p style={{ color: "#6b7280", margin: "8px 0 16px" }}>
        산지에서 매주 선별한 채소를 문앞으로 배송합니다. 신선도 최적화 포장, 저탄소/친환경 지향.
      </p>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        {PLANS.map(p => (
          <article key={p.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, background: "#fff", position: "relative" }}>
            {p.best && <span style={{ position: "absolute", top: 10, right: 10, background: "#16a34a", color: "#fff", borderRadius: 999, padding: "2px 8px", fontSize: 12 }}>BEST</span>}
            <h2 style={{ margin: "0 0 6px" }}>{p.name}</h2>
            <p style={{ margin: "0 0 8px", color: "#6b7280" }}>{p.desc}</p>
            <ul style={{ margin: "0 0 10px 18px" }}>
              <li>구성: {p.items}</li>
              <li>배송: 새벽/일반 선택</li>
              <li>교체: 알러지/기피 식재 교체 가능</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{p.price.toLocaleString()}원/회</strong>
              <Link className="btn" to={`/subscriptions/veggies/apply?plan=${p.id}`}>구독 신청 →</Link>
            </div>
          </article>
        ))}
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>배송 빈도</h3>
        <ul style={{ margin: "6px 0 0 18px" }}>
          <li>주 1회 (월 4회)</li>
          <li>격주 (월 2회)</li>
        </ul>
      </section>
    </main>
  );
}
