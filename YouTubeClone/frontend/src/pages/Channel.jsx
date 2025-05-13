import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const Channel = () => {
  const { currentUser } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const res = await axios.get(`/channels/${currentUser.user._id}/videos`);
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (currentUser) {
      fetchUserVideos();
    }
  }, [currentUser]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '/videos',
        {
          title,
          description,
          videoUrl,
          thumbnailUrl,
        },
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      setVideos([...videos, res.data]);
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setThumbnailUrl('');
    } catch (err) {
      console.error(err);
      alert('Upload failed!');
    }
  };

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setVideos(videos.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete video.');
    }
  };

  return (
    <div className="channel-page">
      <h2>Your Channel: {currentUser?.user?.username}</h2>

      <form className="upload-form" onSubmit={handleUpload}>
        <h3>Upload New Video</h3>

        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Thumbnail URL"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          required
        />
        <button type="submit">Upload</button>
      </form>

      <div className="videos-list">
        <h3>Your Uploaded Videos</h3>
        {videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="video-card">
              <img src={video.thumbnailUrl} alt="thumbnail" className="thumbnail" />
              <div className="video-info">
                <h4>{video.title}</h4>
                <p>{video.description}</p>
                <button onClick={() => handleDelete(video._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Channel;
