import { Link } from 'react-router-dom';
import './LootHeader.css';

const LootHeader: React.FC = () => {
  return (
    <div>
      <div className="row header-links">
        <div className="logo">
          <Link to="/">
            <h1>LootGen</h1>
          </Link>
        </div>

        <div className="row nav-links">
          <a href="https://twitter.com/loot_gen">
            <h3>Twitter</h3>
          </a>
          <Link to="/about">
            <h3>About</h3>
          </Link>
        </div>
      </div>

      <div className="subtitle">
        <h3>
          Generate <a href="https://www.lootproject.com">#loot</a> and share it
          with frens
        </h3>
      </div>
    </div>
  );
};

export default LootHeader;
