// src/components/marketplace/ReviewSection.jsx

import React from 'react';
import Button from '../common/Button';
import './ReviewSection.css';

const StarRating = ({ rating }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewSection = ({ reviews = [] }) => {
  const [newReview, setNewReview] = React.useState('');
  const [newRating, setNewRating] = React.useState(0);

  const handleSubmitReview = () => {
    if (newReview.trim() && newRating > 0) {
      console.log('새 리뷰 제출:', { review: newReview, rating: newRating });
      setNewReview('');
      setNewRating(0);
    } else {
      alert('리뷰 내용과 별점을 입력해주세요!');
    }
  };

  return (
    <div className="review-section-container">
      <h3 className="section-title">구매자 리뷰 ({reviews.length})</h3>

      {/* 리뷰 작성 폼 */}
      <div className="review-form-container">
        <h4 className="form-title">리뷰 작성하기</h4>
        <div className="rating-input">
          <span className="rating-label">내 별점:</span>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`rating-star ${i < newRating ? 'selected' : ''}`}
              onClick={() => setNewRating(i + 1)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          className="review-textarea"
          rows="4"
          placeholder="이 상품에 대한 솔직한 리뷰를 남겨주세요."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        ></textarea>
        <Button onClick={handleSubmitReview} className="submit-review-btn">리뷰 제출</Button>
      </div>

      {/* 기존 리뷰 목록 */}
      {reviews.length === 0 ? (
        <p className="no-reviews-message">아직 작성된 리뷰가 없습니다.</p>
      ) : (
        <div className="review-list">
          {reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <StarRating rating={review.rating} />
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-author">{review.author}</p>
              <p className="review-content">{review.content}</p>
              {review.imageUrl && (
                <img src={review.imageUrl} alt="리뷰 사진" className="review-image" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;