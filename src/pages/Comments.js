import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isCodeValidated = sessionStorage.getItem('isCodeValidated');
    setTimeout(()=> {
      sessionStorage.clear();
      navigate('/code');
    }, 5 * 60 * 1000)
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

  return (
    <div className="comments-container">
      <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
              required
              className="comment-input"
              maxLength={600}
            />
            <button type="submit" className="submit-button" 
                onMouseDown={() => setIsVisible(true)}
                onMouseUp={() => setIsVisible(false)}
                onTouchStart={() => setIsVisible(true)}
                onTouchEnd={() => setIsVisible(false)} >Post Comment</button>
          </form>

      {isVisible && (
        <>
          
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;
