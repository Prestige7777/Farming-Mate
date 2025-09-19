// src/pages/admin/VerificationManagement.jsx

import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUser } from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './VerificationManagement.css';

export default function VerificationManagement() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      const filteredUsers = allUsers.filter(user => user.role === 'consumer' && !user.isVerified);
      setPendingUsers(filteredUsers);
    } catch (err) {
      setError('인증 대기 사용자 정보를 불러오는 데 실패했습니다.');
      console.error('Failed to fetch pending users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (window.confirm('정말로 이 사용자를 판매자로 승인하시겠습니까?')) {
      try {
        await updateUser(userId, { role: 'farmer', isVerified: true });
        alert('사용자가 성공적으로 판매자로 승인되었습니다.');
        fetchPendingUsers(); // Refresh list
      } catch (err) {
        console.error('Failed to approve user:', err);
        alert('사용자 승인에 실패했습니다.');
      }
    }
  };

  const handleReject = async (userId, userName) => {
    const reason = prompt(`${userName} 사용자의 인증 요청을 거절하시겠습니까? 거절 사유를 입력하세요.`);
    if (reason) {
      try {
        alert(`사용자 ${userName}의 인증 요청이 거절되었습니다. 사유: ${reason}`);
        fetchPendingUsers(); // Refresh list
      } catch (err) {
        console.error('Failed to reject user:', err);
        alert('사용자 거절에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <div className="admin-dashboard-page"><main className="admin-dashboard-main">로딩 중...</main></div>;
  }

  if (error) {
    return <div className="admin-dashboard-page"><main className="admin-dashboard-main error">{error}</main></div>;
  }

  return (
    <div className="admin-dashboard-page verification-management">
      <main className="admin-dashboard-main">
        <h1 className="page-title">✅ 판매자 인증 관리</h1>
        <p className="page-subtitle">판매자 인증 및 친환경 인증을 요청한 사용자들의 목록을 확인하고 처리합니다.</p>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>사용자 ID</th>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>신청일</th>
                <th>첨부 서류</th>
                <th>상태</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.length > 0 ? (
                pendingUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.submittedAt || 'N/A'}</td>
                    <td>
                      {user.documentUrl ? (
                        <a href={user.documentUrl} target="_blank" rel="noopener noreferrer">서류 보기</a>
                      ) : (
                        '없음'
                      )}
                    </td>
                    <td>대기 중</td>
                    <td>
                      <button className="table-btn success" onClick={() => handleApprove(user.id)}>승인</button>
                      <button className="table-btn danger" onClick={() => handleReject(user.id, user.name)}>반려</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data-cell">대기 중인 인증 요청이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}