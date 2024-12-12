import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitization

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null); // Reference for the timer

  useEffect(() => {
    const isCodeValidated = sessionStorage.getItem('isCodeValidated');
    setTimeout(() => {
      sessionStorage.clear();
      navigate('/code');
    }, 5 * 60 * 1000);
    if (!isCodeValidated) {
      navigate('/code');
    } else {
      const fetchComments = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments`);
          setComments(res.data);
        } catch (err) {
          console.error('Failed to load comments', err);
        }
      };

      fetchComments();
    }
  }, [navigate]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/comments`, { text: commentText });
      setComments([...comments, res.data]);
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleMouseDown = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 5000);
  };

  const handleMouseUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="comments-container">
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment here... You can use <b>HTML</b>!"
          required
          className="comment-input"
          maxLength={600}
        />
        <button
          type="submit"
          className="submit-button"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          Post Comment
        </button>
      </form>

      {isVisible && (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(comment.text),
                }}
              />
              <p className="comment-date">
                {formatDate(comment.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
