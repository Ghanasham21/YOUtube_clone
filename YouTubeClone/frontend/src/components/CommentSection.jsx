import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const CommentSection = ({ videoId }) => {
  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/videos/${videoId}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      if (editCommentId) {
        await axios.put(`/comments/${editCommentId}`, { text }, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        setComments(
          comments.map((comment) =>
            comment._id === editCommentId ? { ...comment, text } : comment
          )
        );
        setEditCommentId(null);
      } else {
        const res = await axios.post(
          `/videos/${videoId}/comments`,
          { text },
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );
        setComments([...comments, res.data]);
      }
      setText('');
    } catch (err) {
      console.error(err);
      alert('Failed to post comment.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/comments/${id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete comment.');
    }
  };

  const handleEdit = (comment) => {
    setEditCommentId(comment._id);
    setText(comment.text);
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>

      {currentUser ? (
        <form className="comment-form" onSubmit={handleAddComment}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button type="submit">{editCommentId ? 'Update' : 'Post'}</button>
        </form>
      ) : (
        <p>Please login to comment.</p>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <p><strong>{comment.username}:</strong> {comment.text}</p>
              {currentUser?.user?._id === comment.userId && (
                <div className="comment-actions">
                  <button onClick={() => handleEdit(comment)}>Edit</button>
                  <button onClick={() => handleDelete(comment._id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
