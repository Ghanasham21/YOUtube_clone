import '../App.css';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {isOpen && (
        <div className="categories">
          <button>All</button>
          <button>React</button>
          <button>Node.js</button>
          <button>MongoDB</button>
          <button>JavaScript</button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
