import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import '../App.css';

const VideoPlayer = () => {
  const { id } = useParams(); // video id from URL
  const { currentUser } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/videos/${id}`);
        setVideo(res.data);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    try {
      await axios.put(`/videos/${id}/like`);
      setVideo({ ...video, likes: video.likes + 1 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.put(`/videos/${id}/dislike`);
      setVideo({ ...video, dislikes: video.dislikes + 1 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert('Please sign in to comment.');
    try {
      const res = await axios.post(`/comments/${id}`, {
        text: newComment,
      }, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className="video-player-page">
      <div className="video-section">
        <video controls width="100%" src={video.videoUrl} />
        <h2>{video.title}</h2>
        <p>{video.description}</p>
        
        <p><strong>Channel:</strong> {video.uploader?.username}</p>

        <div className="actions">
          <button onClick={handleLike}>👍 {video.likes}</button>
          <button onClick={handleDislike}>👎 {video.dislikes}</button>
        </div>
      </div>

      <div className="comment-section">
        <CommentSection videoId={video._id} />
        <h3>Comments</h3>

        {currentUser && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
        )}

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p><strong>{comment.username}</strong> - {new Date(comment.timestamp).toLocaleDateString()}</p>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
