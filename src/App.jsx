import { useState } from 'react';
import Gallery from './components/Gallery';
import { ChevronDown, Grid3X3, LayoutGrid, List } from 'lucide-react';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'scattered' | 'list'
  const [activeCategory, setActiveCategory] = useState(null);
  const [acquisition, setAcquisition] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = ['Work', 'Play', 'Eat', 'Wear'];
  const acquisitionOptions = ['All', 'Bought', 'Gifted', 'Earned'];

  // Theme class based on view mode
  const themeClass = `theme-${viewMode}`;

  return (
    <div className={`app ${themeClass}`}>
      <header className="header">
        <div className="header-left">
          <a href="#about" className="nav-link about-link">About</a>
        </div>
        
        <h1 className="site-title">Nicely designed things</h1>
        
        <div className="header-right">
        </div>
      </header>

      <div className="filter-bar">
        <div className="filter-section">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            >
              {cat}
            </button>
          ))}
          
          <div className="filter-dropdown-wrapper">
            <button 
              className="filter-dropdown"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{acquisition}</span>
              <ChevronDown size={14} />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {acquisitionOptions.map((option) => (
                  <button
                    key={option}
                    className={`dropdown-item ${acquisition === option ? 'active' : ''}`}
                    onClick={() => {
                      setAcquisition(acquisition === option ? '' : option);
                      setDropdownOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="view-toggles">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <Grid3X3 size={16} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'scattered' ? 'active' : ''}`}
            onClick={() => setViewMode('scattered')}
            aria-label="Scattered view"
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <main>
        <Gallery viewMode={viewMode} />
      </main>
    </div>
  );
}

export default App;
