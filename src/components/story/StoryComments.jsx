// src/components/story/StoryComments.jsx

import React from 'react';
import Button from '../common/Button';
import './StoryComments.css';

const StoryComments = ({ comments = [] }) => {
  const [newComment, setNewComment] = React.useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      console.log('새 댓글 제출:', newComment);
      setNewComment('');
    } else {
      alert('댓글 내용을 입력해주세요!');
    }
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">댓글 ({comments.length})</h3>

      <div className="comment-form-container">
        <textarea
          className="comment-textarea"
          rows="3"
          placeholder="댓글을 남겨주세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <Button onClick={handleSubmitComment} className="submit-comment-btn">댓글 달기</Button>
      </div>

      {comments.length === 0 ? (
        <p className="no-comments-message">아직 작성된 댓글이 없습니다.</p>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">{comment.date}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryComments;