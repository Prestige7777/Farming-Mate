// src/pages/ReportProblemPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import './ReportProblemPage.css';

export default function ReportProblemPage() {
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // 현재 사용자 정보 가져오기

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !content) {
      alert('신고 유형을 선택하고 내용을 입력해주세요.');
      return;
    }
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    const newReport = {
      userId: user.id,
      category,
      content,
      createdAt: new Date().toISOString(),
      status: 'new', // 초기 상태는 'new'
    };

    try {
      const response = await fetch('http://localhost:3001/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReport),
      });

      if (!response.ok) {
        throw new Error('신고 접수에 실패했습니다.');
      }

      alert('신고가 성공적으로 접수되었습니다.');
      navigate('/'); // 홈으로 이동
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-problem-page">
      <h1>문제 신고</h1>
      <p>서비스 이용 중 불편한 점이나 개선할 점을 알려주세요.</p>
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="category">신고 유형</label>
          <select 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">유형 선택</option>
            <option value="bug">오류/버그 신고</option>
            <option value="user">불편 사용자 신고</option>
            <option value="payment">결제/주문 관련</option>
            <option value="suggestion">개선 제안</option>
            <option value="etc">기타</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="content">신고 내용</label>
          <textarea
            id="content"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="자세한 내용을 작성해주세요."
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? '제출 중...' : '신고 제출'}
        </button>
      </form>
    </div>
  );
}
