import { useEffect, useState } from 'react';
import axios from '../api/axios';
import VideoCard from '../components/VideoCard';
import { useLocation } from 'react-router-dom';
import '../App.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('/videos');
        let filtered = res.data;
        if (searchQuery) {
          filtered = filtered.filter(video =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setVideos(filtered);
      } catch (err) {
        console.log(err);
      }
    };
    fetchVideos();
  }, [searchQuery]);

  return (
    <div className="home">
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Home;
