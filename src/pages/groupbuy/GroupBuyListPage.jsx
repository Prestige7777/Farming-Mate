// src/pages/groupbuy/GroupBuyListPage.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const mockGroupBuys = [
  { id: "gb_apple_01", title: "청송 사과 5kg 공동구매", heroImage: "https://placehold.co/960x540.png?text=Apple5kg",
    farm: { name: "청송애플팜", isPremium: true }, unit: { label: "5kg/박스", basePrice: 22000 },
    tiers: [{ minQty: 50, price: 20000 }, { minQty: 100, price: 18500 }],
    deadline: "2025-09-30T15:00:00+09:00", currentQty: 63, status: "open" },
  { id: "gb_grape_02", title: "샤인머스캣 2kg 공동구매", heroImage: "https://placehold.co/960x540.png?text=Shine+Muscat",
    farm: { name: "영동포도원", isPremium: false }, unit: { label: "2kg/박스", basePrice: 29000 },
    tiers: [{ minQty: 30, price: 27000 }], deadline: "2025-09-28T23:59:59+09:00", currentQty: 12, status: "open" },
  { id: "gb_peach_03", title: "영천 복숭아 4.5kg", heroImage: "https://placehold.co/960x540.png?text=Peach",
    farm: { name: "영천과원", isPremium: false }, unit: { label: "4.5kg/박스", basePrice: 26000 },
    tiers: [{ minQty: 40, price: 24000 }, { minQty: 80, price: 22000 }], deadline: "2025-09-22T23:59:59+09:00", currentQty: 39, status: "open" },
  { id: "gb_pear_04", title: "나주 배 10과", heroImage: "https://placehold.co/960x540.png?text=Pear",
    farm: { name: "나주과수원", isPremium: true }, unit: { label: "10과", basePrice: 34000 },
    tiers: [{ minQty: 60, price: 32000 }, { minQty: 120, price: 30000 }], deadline: "2025-10-05T15:00:00+09:00", currentQty: 77, status: "open" },
  { id: "gb_tom_05", title: "방울토마토 3kg", heroImage: "https://placehold.co/960x540.png?text=Cherry+Tomato",
    farm: { name: "부여토마토농원", isPremium: false }, unit: { label: "3kg/박스", basePrice: 17000 },
    tiers: [{ minQty: 50, price: 16000 }, { minQty: 100, price: 15000 }], deadline: "2025-09-25T21:00:00+09:00", currentQty: 58, status: "open" },
  { id: "gb_melon_06", title: "성주 참외 5kg", heroImage: "https://placehold.co/960x540.png?text=Korean+Melon",
    farm: { name: "성주참외팜", isPremium: true }, unit: { label: "5kg/박스", basePrice: 24000 },
    tiers: [{ minQty: 80, price: 22000 }], deadline: "2025-09-27T12:00:00+09:00", currentQty: 26, status: "open" },
];

export default function GroupBuyListPage() {
  const items = useMemo(() => mockGroupBuys, []);
  return (
    <main className="container" style={{ padding: "20px 16px" }}>
      <h1 style={{ margin: "4px 0 16px" }}>공동구매</h1>

      <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, listStyle: "none", padding: 0 }}>
        {items.map((gb) => {
          const dday = Math.ceil((new Date(gb.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          return (
            <li key={gb.id} style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
              <Link to={`/group-buy/${gb.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                <img src={gb.heroImage} alt={gb.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    {gb.farm.isPremium && <span style={{ fontSize: 12, background: "#111827", color: "#fff", padding: "2px 6px", borderRadius: 6 }}>PREMIUM</span>}
                    <strong>{gb.farm.name}</strong>
                  </div>
                  <h3 style={{ margin: "6px 0 8px", fontSize: 18 }}>{gb.title}</h3>
                  <p style={{ margin: 0, color: "#6b7280" }}>{gb.unit.label}</p>
                  <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600 }}>{gb.currentQty}명 참여</span>
                    <span style={{ fontSize: 13, color: dday > 0 ? "#ef4444" : "#6b7280" }}>{dday > 0 ? `D-${dday}` : "마감 임박/마감"}</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}