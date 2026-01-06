import { useState, useEffect, useRef } from 'react';
import Gallery from './components/Gallery';
import { 
  NavArrowDown, 
  DotsGrid3x3, 
  FrameAltEmpty, 
  MenuScale,
  Bag,
  Gamepad,
  PizzaSlice,
  Sandals
} from 'iconoir-react';
import './App.css';

// Category icons mapping
const categoryIcons = {
  Work: Bag,
  Play: Gamepad,
  Eat: PizzaSlice,
  Wear: Sandals
};

function App() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'scattered' | 'list'
  const [activeCategories, setActiveCategories] = useState([]); // Array for multi-select
  const [acquisition, setAcquisition] = useState('All');
  const [color, setColor] = useState('All');
  const [country, setCountry] = useState('All');
  const [openDropdown, setOpenDropdown] = useState(null); // 'acquisition' | 'color' | 'country' | null

  const categories = ['Work', 'Play', 'Eat', 'Wear'];
  const acquisitionOptions = ['All', 'Bought', 'Gifted', 'Earned'];
  const colorOptions = ['All', 'White', 'Black', 'Brown', 'Blue', 'Green', 'Red', 'Yellow', 'Multi'];
  const countryOptions = ['All', 'India', 'Japan', 'USA', 'UK', 'Italy', 'France', 'Germany', 'China'];

  const filterRef = useRef(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCategory = (cat) => {
    setActiveCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat)  // Remove if already selected
        : [...prev, cat]                // Add if not selected
    );
  };

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
        <div className="filter-section" ref={filterRef}>
          {categories.map((cat) => {
            const IconComponent = categoryIcons[cat];
            return (
              <button
                key={cat}
                className={`filter-pill ${activeCategories.includes(cat) ? 'active' : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                <IconComponent width={16} height={16} strokeWidth={1.8} />
                <span>{cat}</span>
              </button>
            );
          })}
          
          <div className="filter-divider"></div>
          
          <div className="filter-dropdown-wrapper">
            <button 
              className="filter-dropdown"
              onClick={() => toggleDropdown('acquisition')}
            >
              <span>{acquisition === 'All' ? 'Source' : acquisition}</span>
              <NavArrowDown width={16} height={16} strokeWidth={1.8} />
            </button>
            {openDropdown === 'acquisition' && (
              <div className="dropdown-menu">
                {acquisitionOptions.map((option) => (
                  <button
                    key={option}
                    className={`dropdown-item ${acquisition === option ? 'active' : ''}`}
                    onClick={() => {
                      setAcquisition(option);
                      setOpenDropdown(null);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="filter-dropdown-wrapper">
            <button 
              className="filter-dropdown"
              onClick={() => toggleDropdown('color')}
            >
              <span>{color === 'All' ? 'Color' : color}</span>
              <NavArrowDown width={16} height={16} strokeWidth={1.8} />
            </button>
            {openDropdown === 'color' && (
              <div className="dropdown-menu">
                {colorOptions.map((option) => (
                  <button
                    key={option}
                    className={`dropdown-item ${color === option ? 'active' : ''}`}
                    onClick={() => {
                      setColor(option);
                      setOpenDropdown(null);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="filter-dropdown-wrapper">
            <button 
              className="filter-dropdown"
              onClick={() => toggleDropdown('country')}
            >
              <span>{country === 'All' ? 'Country' : country}</span>
              <NavArrowDown width={16} height={16} strokeWidth={1.8} />
            </button>
            {openDropdown === 'country' && (
              <div className="dropdown-menu">
                {countryOptions.map((option) => (
                  <button
                    key={option}
                    className={`dropdown-item ${country === option ? 'active' : ''}`}
                    onClick={() => {
                      setCountry(option);
                      setOpenDropdown(null);
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
            <DotsGrid3x3 width={16} height={16} strokeWidth={1.8} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'scattered' ? 'active' : ''}`}
            onClick={() => setViewMode('scattered')}
            aria-label="Scattered view"
          >
            <FrameAltEmpty width={16} height={16} strokeWidth={1.8} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <MenuScale width={16} height={16} strokeWidth={1.8} />
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
