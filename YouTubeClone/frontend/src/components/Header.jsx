import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/?search=${search}`);
    }
  };

  return (
    <div className="header">
      <div className="logo">📺 YouTube Clone</div>

      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
      />

      <div className="auth">
        {currentUser ? (
          <div className="user-info">
            <img src={currentUser.avatar} alt="avatar" className="avatar" />
            <span>{currentUser.username}</span>
          </div>
        ) : (
          <Link to="/login" className="signin-btn">Sign In</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
