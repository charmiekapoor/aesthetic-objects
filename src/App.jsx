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
  Sandals,
  Sofa,
  Droplet
} from 'iconoir-react';
import './App.css';

// Category icons mapping
const CareIcon = ({ ...props }) => <Droplet {...props} strokeWidth={1.8} />;

const categoryIcons = {
  Live: Sofa,
  Work: Bag,
  Play: Gamepad,
  Eat: PizzaSlice,
  Wear: Sandals,
  Care: CareIcon
};

// Country flag emojis
const countryFlags = {
  'All': '🌍',
  'India': '🇮🇳',
  'USA': '🇺🇸',
  'Japan': '🇯🇵',
  'France': '🇫🇷',
  'Singapore': '🇸🇬',
  'Sri Lanka': '🇱🇰',
  'Czech Republic': '🇨🇿',
};

// Color hex values for swatches
const colorHex = {
  'All': 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
  'White': '#FFFFFF',
  'Black': '#1a1a1a',
  'Brown': '#8B4513',
  'Blue': '#3B82F6',
  'Green': '#22C55E',
  'Red': '#EF4444',
  'Yellow': '#FACC15',
  'Orange': '#F97316',
  'Gold': '#D4AF37',
  'Beige': '#D4C4A8',
  'Grey': '#9CA3AF',
  'Pink': '#EC4899',
  'Purple': '#A855F7',
  'Multicolor': 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
};

function App() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'scattered' | 'list'
  const [activeCategories, setActiveCategories] = useState([]); // Array for multi-select
  const [acquisition, setAcquisition] = useState('All');
  const [color, setColor] = useState('All');
  const [country, setCountry] = useState('All');
  const [openDropdown, setOpenDropdown] = useState(null); // 'acquisition' | 'color' | 'country' | null

  const categories = ['Live', 'Work', 'Play', 'Eat', 'Wear', 'Care'];
  const acquisitionOptions = ['All', 'Bought', 'Gifted', 'Earned'];
  const colorOptions = ['All', 'White', 'Black', 'Brown', 'Blue', 'Green', 'Red', 'Yellow', 'Orange', 'Gold', 'Beige', 'Grey', 'Pink', 'Purple', 'Multicolor'];
  const countryOptions = ['All', 'India', 'USA', 'Japan', 'France', 'Singapore', 'Sri Lanka', 'Czech Republic'];

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

  // Check if any filters are active
  const hasActiveFilters = activeCategories.length > 0 || acquisition !== 'All' || color !== 'All' || country !== 'All';

  // Clear all filters
  const clearFilters = () => {
    setActiveCategories([]);
    setAcquisition('All');
    setColor('All');
    setCountry('All');
  };

  // Theme class based on view mode
  const themeClass = `theme-${viewMode}`;

  return (
    <div className={`app ${themeClass}`}>
      <header className="header">
        <div className="header-left">
          <h1 className="site-title">Nicely Designed Things</h1>
        </div>
        
        <div className="header-right">
          <a href="#about" className="nav-link about-link">About</a>
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
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {color !== 'All' && (
                  <span 
                    className="color-dot" 
                    style={{ background: colorHex[color] }}
                  />
                )}
                {color === 'All' ? 'Color' : color}
              </span>
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
                    {option !== 'All' && (
                      <span 
                        className="color-dot" 
                        style={{ background: colorHex[option] }}
                      />
                    )}
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
              <span>{country === 'All' ? 'Country' : `${countryFlags[country]}  ${country}`}</span>
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
                    {option !== 'All' && `${countryFlags[option]}  `}{option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        <div className="view-toggles">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <DotsGrid3x3 width={16} height={16} strokeWidth={2} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'scattered' ? 'active' : ''}`}
            onClick={() => setViewMode('scattered')}
            aria-label="Scattered view"
          >
            <FrameAltEmpty width={16} height={16} strokeWidth={2} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <MenuScale width={16} height={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <main>
        <Gallery 
          viewMode={viewMode} 
          activeCategories={activeCategories}
          acquisition={acquisition}
          color={color}
          country={country}
        />
      </main>
    </div>
  );
}

export default App;
