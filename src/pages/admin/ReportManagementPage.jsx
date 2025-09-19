// src/pages/admin/ReportManagementPage.jsx
import React, { useEffect, useState } from 'react';
import './ReportManagementPage.css';

export default function ReportManagementPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:3001/reports');
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        // 최신순으로 정렬
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReports(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="report-management-page"><h2>로딩 중...</h2></div>;
  }

  if (error) {
    return <div className="report-management-page"><h2>오류: {error}</h2></div>;
  }

  return (
    <div className="report-management-page">
      <h1>문제 신고 관리</h1>
      <div className="report-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>신고자</th>
              <th>유형</th>
              <th>내용</th>
              <th>신고일</th>
              <th>상태</th>
              <th>조치</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.userId}</td>
                <td>{report.category}</td>
                <td className="content-cell">{report.content}</td>
                <td>{new Date(report.createdAt).toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-${report.status}`}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn">처리</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
