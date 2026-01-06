import { useState } from 'react';
import Gallery from './components/Gallery';
import { Sun, Moon, Sparkles, ChevronDown, Grid3X3, LayoutGrid, List } from 'lucide-react';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'scattered' | 'list'

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <a href="#about" className="nav-link about-link">About</a>
        </div>
        
        <h1 className="site-title">Nicely designed things</h1>
        
        <div className="header-right">
          <div className="theme-icons">
            <button className="theme-btn" aria-label="Sun theme">
              <Sun size={18} className="theme-icon" />
            </button>
            <button className="theme-btn" aria-label="Moon theme">
              <Moon size={18} className="theme-icon" />
            </button>
            <button className="theme-btn" aria-label="Sparkles theme">
              <Sparkles size={18} className="theme-icon" />
            </button>
          </div>
        </div>
      </header>

      <div className="filter-bar">
        <div className="filter-section">
          <div className="filter-dropdown">
            <span>Style</span>
            <ChevronDown size={14} />
          </div>
          <div className="filter-dropdown">
            <span>Room</span>
            <ChevronDown size={14} />
          </div>
          <div className="filter-dropdown">
            <span>Color</span>
            <ChevronDown size={14} />
          </div>
          <div className="filter-dropdown">
            <span>Material</span>
            <ChevronDown size={14} />
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
