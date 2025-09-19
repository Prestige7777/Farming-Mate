// src/pages/stories/PackagingStoryPage.jsx
import React from "react";

export default function PackagingStoryPage() {
  return (
    <main className="container" style={{ padding: "20px 16px", display: "grid", gap: 20 }}>
      <header>
        <h1 style={{ margin: 0 }}>포장 개선 프로젝트</h1>
        <p style={{ color: "#6b7280", marginTop: 6 }}>
          우리는 종이 기반 포장, 생분해성 완충재, 아이스팩 회수 등으로 포장 쓰레기를 줄이고 신선도를 높였습니다.
        </p>
      </header>

      <section style={{ display: "grid", gap: 12 }}>
        <img src="https://placehold.co/1280x640?text=Paper+Packaging" alt="종이 포장" style={{ width: "100%", borderRadius: 12 }} />
        <h2 style={{ margin: "0 0 6px" }}>1) 플라스틱에서 종이로</h2>
        <p>PVC 비닐 포장 대신, FSC 인증 종이와 콩기름 잉크 인쇄로 대체했습니다. 재활용률이 높고, 인쇄 공정에서도 환경 부담을 줄였습니다.</p>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <img src="https://placehold.co/1280x640?text=Biodegradable+Cushion" alt="생분해성 완충재" style={{ width: "100%", borderRadius: 12 }} />
        <h2 style={{ margin: "0 0 6px" }}>2) 생분해성 완충재</h2>
        <p>옥수수 전분 기반 완충재를 사용합니다. 제품을 안전하게 보호하면서도, 사용 후 분해되어 환경 부담을 낮춥니다.</p>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <img src="https://placehold.co/1280x640?text=Cold+Chain" alt="콜드체인" style={{ width: "100%", borderRadius: 12 }} />
        <h2 style={{ margin: "0 0 6px" }}>3) 콜드체인 & 아이스팩 회수</h2>
        <p>신선도가 중요한 과일·채소는 저온 유통망을 강화했고, 아이스팩은 회수·재사용 시스템으로 폐기량을 줄였습니다.</p>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <img src="https://placehold.co/1280x640?text=Result" alt="개선 결과" style={{ width: "100%", borderRadius: 12 }} />
        <h2 style={{ margin: "0 0 6px" }}>결과</h2>
        <ul style={{ margin: "0 0 0 18px" }}>
          <li>포장 폐기물 37% 감소</li>
          <li>파손/신선도 클레임 22% 감소</li>
          <li>고객 만족도(포장 항목) 4.6/5.0</li>
        </ul>
      </section>
    </main>
  );
}