// src/pages/SeasonalFruitspage.jsx
import React, { useMemo } from "react";

const FRUITS = [
  { id: "f_apl_5",  name: "사과 5kg",    month: "9~11월", origin: "경북 청송",  grade: "특", price: 22000, img: "https://placehold.co/640x400?text=Apple5kg" },
  { id: "f_pea_2",  name: "복숭아 2kg",  month: "7~8월",  origin: "경북 의성",  grade: "상", price: 18000, img: "https://placehold.co/640x400?text=Peach2kg" },
  { id: "f_grp_2",  name: "샤인머스캣 2kg", month: "8~10월", origin: "충북 영동", grade: "프리미엄", price: 29000, img: "https://placehold.co/640x400?text=Shine+Muscat" },
  { id: "f_per_10", name: "배 10과",    month: "9~10월", origin: "충남 천안",  grade: "특", price: 33000, img: "https://placehold.co/640x400?text=Pear" },
  { id: "f_cit_10", name: "감귤 10kg",  month: "11~2월", origin: "제주",       grade: "상", price: 27000, img: "https://placehold.co/640x400?text=Tangerine" },
  { id: "f_ber_1",  name: "블루베리 1kg", month: "6~8월", origin: "강원 강릉",  grade: "상", price: 24000, img: "https://placehold.co/640x400?text=Blueberry" },
  { id: "f_str_2",  name: "딸기 2kg",   month: "12~3월", origin: "충남 논산",  grade: "프리미엄", price: 28000, img: "https://placehold.co/640x400?text=Strawberry" },
  { id: "f_wtm_1",  name: "수박 1통",   month: "6~8월",  origin: "전북 고창",  grade: "상", price: 15000, img: "https://placehold.co/640x400?text=Watermelon" },
];

export default function SeasonalFruitsPage() {
  const items = useMemo(() => FRUITS, []);
  return (
    <main className="container" style={{ padding: "20px 16px" }}>
      <h1 style={{ margin: "0 0 12px" }}>제철 과일 모아보기</h1>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>
        산지에서 바로, 지금이 가장 맛있는 과일들을 큐레이션했어요.
      </p>

      <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, listStyle: "none", padding: 0 }}>
        {items.map(x => (
          <li key={x.id} style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            <img src={x.img} alt={x.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
            <div style={{ padding: 12 }}>
              <strong style={{ display: "block", marginBottom: 6 }}>{x.name}</strong>
              <div style={{ color: "#6b7280", fontSize: 14, display: "grid", gap: 2 }}>
                <span>제철: {x.month}</span>
                <span>원산지: {x.origin}</span>
                <span>등급: {x.grade}</span>
              </div>
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>{x.price.toLocaleString()}원</span>
                <button className="btn">장바구니</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}