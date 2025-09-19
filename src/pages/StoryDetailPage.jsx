// src/pages/StoryDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStoryById, updateStory, getUserById } from '../utils/api';
import { useAuth } from '../components/auth/AuthProvider';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import EditStoryModal from '../components/story/EditStoryModal';
import './StoryDetailPage.css';

const StoryDetailPage = () => {
  const { storyId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const fetchedStory = await getStoryById(storyId);
        const farmer = await getUserById(fetchedStory.farmerId);
        setStory({ ...fetchedStory, farmerProfileImageUrl: farmer.profileImageUrl, farmerName: farmer.name });
      } catch (err) {
        setError('스토리를 불러오는 데 실패했습니다.');
        console.error("Failed to fetch story:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  const handleLikeToggle = async () => {
    if (!user) {
      alert('로그인 후 좋아요를 누를 수 있습니다.');
      navigate('/login');
      return;
    }

    if (!story) return;

    const updatedLikes = story.likes.includes(user.id)
      ? story.likes.filter(id => id !== user.id)
      : [...story.likes, user.id];

    try {
      await updateStory(story.id, { likes: updatedLikes });
      setStory(prev => ({ ...prev, likes: updatedLikes }));
    } catch (err) {
      console.error("Failed to update likes:", err);
      alert('좋아요 업데이트에 실패했습니다.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      navigate('/login');
      return;
    }
    if (!story || !newComment.trim()) return;

    const commentId = `c${Date.now()}`;
    const comment = {
      id: commentId,
      userId: user.id,
      userName: user.name,
      text: newComment.trim(),
      date: new Date().toISOString(),
    };

    const updatedComments = [...story.comments, comment];

    try {
      await updateStory(story.id, { comments: updatedComments });
      setStory(prev => ({ ...prev, comments: updatedComments }));
      setNewComment('');
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert('댓글 추가에 실패했습니다.');
    }
  };

  const goToNextImage = () => {
    if (story && story.images && story.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % story.images.length);
    }
  };

  const goToPreviousImage = () => {
    if (story && story.images && story.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + story.images.length) % story.images.length);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="story-detail-error">{error}</div>;
  }

  if (!story) {
    return <div className="story-detail-not-found">스토리를 찾을 수 없습니다.</div>;
  }

  const isLiked = user && story.likes.includes(user.id);

  return (
    <div className="story-detail-page">
      <main className="story-detail-main">
        <div className="story-header">
          <Link to={`/farmers/${story.farmerId}/public`} className="farmer-info-link">
            <img src={story.farmerProfileImageUrl || 'https://placehold.co/40x40/e0e0e0/333?text=User'} alt={story.farmerName} className="farmer-profile-image" />
            <span className="farmer-name">{story.farmerName} 농부님</span>
          </Link>
          {user && user.id === story.farmerId && (
            <Button onClick={() => setShowEditModal(true)} className="edit-story-button">수정</Button>
          )}
        </div>

        {story.images && story.images.length > 0 && (
          <div className="story-image-slider">
            <img src={story.images[currentImageIndex]} alt={story.title} className="story-main-image" />
            {story.images.length > 1 && (
              <>
                <button onClick={goToPreviousImage} className="slider-button prev">&lt;</button>
                <button onClick={goToNextImage} className="slider-button next">&gt;</button>
                <div className="image-indicator">
                  {currentImageIndex + 1} / {story.images.length}
                </div>
              </>
            )}
          </div>
        )}

        <div className="story-actions-and-meta">
          <div className="story-actions">
            <button onClick={handleLikeToggle} className={`like-button ${isLiked ? 'liked' : ''}`}>
              {isLiked ? '♥' : '♡'} <span className="like-count-number">{story.likes.length}</span>
            </button>
            <span className="comment-count">𐂃 {story.comments.length}</span>
          </div>
          <h1 className="story-title">{story.title}</h1>
          <p className="story-content">{story.content}</p>
          <span className="story-date">{new Date(story.date).toLocaleDateString()}</span>
        </div>

        <div className="story-comments-section">
          <h3>댓글 ({story.comments.length})</h3>
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 작성하세요..."
              rows="3"
              required
            ></textarea>
            <Button type="submit">댓글 달기</Button>
          </form>
          <div className="comments-list">
            {story.comments.length === 0 ? (
              <p>아직 댓글이 없습니다.</p>
            ) : (
              story.comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <span className="comment-author">{comment.userName}</span>
                  <span className="comment-date">{new Date(comment.date).toLocaleDateString()}</span>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {showEditModal && (
        <EditStoryModal
          story={story}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedStory) => setStory(updatedStory)}
        />
      )}
    </div>
  );
};

export default StoryDetailPage;