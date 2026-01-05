import Gallery from './components/Gallery';
import { Home, Sun, Moon, Sparkles, ChevronDown } from 'lucide-react';
import './App.css';

function App() {
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

      <main>
        <Gallery />
      </main>
    </div>
  );
}

export default App;
