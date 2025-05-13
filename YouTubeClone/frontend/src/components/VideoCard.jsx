import { Link } from 'react-router-dom';
import '../App.css';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} className="video-card">
      <img src={video.thumbnailUrl} alt="thumbnail" />
      <div className="video-info">
        <h4>{video.title}</h4>
        <p>{video.uploader?.username}</p>
        <p>{video.views} views</p>
      </div>
    </Link>
  );
};

export default VideoCard;
