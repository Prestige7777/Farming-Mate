// src/components/farmer/FarmingDataGraph.jsx

import React from 'react';
import './FarmingDataGraph.css';

const FarmingDataGraph = ({ data }) => {
  if (!data || !data.history || data.history.length === 0) {
    return <div className="no-data-message">스마트팜 데이터가 아직 없습니다.</div>;
  }

  const latestData = data.history[data.history.length - 1] || data;

  return (
    <div className="farming-data-graph-container">
      <div className="header-row">
        <h3 className="graph-title">실시간 재배 환경</h3>
        <span className="last-updated">최근 업데이트: {data.lastUpdated}</span>
      </div>
      <div className="data-grid">
        <div className="data-card">
          <span className="data-label">현재 온도</span>
          <span className="data-value temperature-value">{latestData.temp || data.temperature}°C</span>
        </div>
        <div className="data-card">
          <span className="data-label">현재 습도</span>
          <span className="data-value humidity-value">{latestData.hum || data.humidity}%</span>
        </div>
        <div className="data-card">
          <span className="data-label">토양 수분</span>
          <span className="data-value soil-moisture-value">{data.soilMoisture}%</span>
        </div>
      </div>
      <div className="graph-area">
        <p className="graph-placeholder-text">실제 온도/습도 변화 그래프가 여기에 표시됩니다. (Chart.js 등)</p>
      </div>
    </div>
  );
};

export default FarmingDataGraph;