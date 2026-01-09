import { useState, useEffect, useMemo, useRef } from 'react';
import Gallery from './components/Gallery';
import { galleryImages } from './data/images';
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
  Droplet,
  Xmark
} from 'iconoir-react';
import './App.css';

const DESKTOP_BREAKPOINT = 1024;
const LOADER_DURATION_MS = 1300;
const LOADER_EXIT_DURATION_MS = 400;

function AboutModal({ onClose, viewMode, featured = [] }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const carouselItems = [...featured, ...featured];

  return (
    <div
      className={`about-modal-overlay about-modal-overlay--${viewMode}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      aria-describedby="about-modal-body"
      onClick={onClose}
    >
      <div className={`about-modal about-modal--${viewMode}`} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="about-modal__close"
          onClick={onClose}
          aria-label="Close about modal"
          ref={closeButtonRef}
        >
          <Xmark width={16} height={16} strokeWidth={2} />
        </button>
        <h2 id="about-modal-title">The space around you is a reflection of your taste.</h2>
        <p id="about-modal-body">
        I derive a lot of joy from the spaces and objects I live with. I like noticing how things are made, the small details someone cared enough to think through, and how those choices make all the difference.
        </p>
        <p id="about-modal-body">
        This is a collection of the beautifully designed objects I own today. None of them are here just to look nice. They all serve a purpose and get used often. If anything, this project is areminder that useful things can still be beautiful :)
        </p>

        <p id="about-modal-body">
        A few photos of these objects in my space –
        </p>
       
        {featured.length > 0 && (
          <div className="about-modal-carousel" aria-label="Featured objects">
            <div className="about-modal-carousel-track">
              {carouselItems.map((item, index) => (
                <figure
                  key={`${item.id}-${index}`}
                  className="about-modal-carousel-item"
                >
                  <picture>
                    {item.webpSrc && (
                      <source
                        type="image/webp"
                        srcSet={item.webpSrc}
                      />
                    )}
                    <img
                      src={item.src}
                      alt={item.name || `Gallery item ${item.id}`}
                      loading="lazy"
                      draggable="false"
                    />
                  </picture>
                </figure>
              ))}
            </div>
            <div className="about-modal-carousel-footer">
              Made with a lot of love by{' '}
              <a
                href="https://x.com/charmiekapoor"
                target="_blank"
                rel="noreferrer"
              >
                Charmie Kapoor.
              </a>
            </div>
          </div>
        )}
       
      </div>
    </div>
  );
}

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

const sortOptions = [
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
  { value: 'most-least', label: 'Most to least expensive' },
  { value: 'least-most', label: 'Least to most expensive' },
  { value: 'vibes', label: 'Vibes' },
];

const viewModes = [
  { key: 'grid', label: 'Grid view', Icon: DotsGrid3x3 },
  { key: 'scattered', label: 'Canvas view', Icon: FrameAltEmpty },
  { key: 'list', label: 'List view', Icon: MenuScale },
];
const FEATURED_MODAL_IMAGES = [
  { id: 'carousel-1', src: '/Carousel/IMG_0370.jpeg', webpSrc: '/Carousel/IMG_0370.webp' },
  { id: 'carousel-2', src: '/Carousel/IMG_0897.jpeg', webpSrc: '/Carousel/IMG_0897.webp' },
  { id: 'carousel-3', src: '/Carousel/IMG_2071.jpeg', webpSrc: '/Carousel/IMG_2071.webp' },
  { id: 'carousel-4', src: '/Carousel/IMG_2452.jpeg', webpSrc: '/Carousel/IMG_2452.webp' },
  { id: 'carousel-5', src: '/Carousel/IMG_2457.jpeg', webpSrc: '/Carousel/IMG_2457.webp' },
  { id: 'carousel-6', src: '/Carousel/IMG_2539.jpeg', webpSrc: '/Carousel/IMG_2539.webp' },
  { id: 'carousel-7', src: '/Carousel/IMG_3638.jpeg', webpSrc: '/Carousel/IMG_3638.webp' },
  { id: 'carousel-8', src: '/Carousel/IMG_5752.jpeg', webpSrc: '/Carousel/IMG_5752.webp' },
];
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

const LOADER_LAYOUT = [
  {
    offsetX: '-180px',
    offsetY: '-160px',
    rotate: '-12deg',
    delay: '0s',
    exitX: '-400px',
    exitY: '-330px',
    exitRotate: '-18deg',
  },
  {
    offsetX: '200px',
    offsetY: '-140px',
    rotate: '6deg',
    delay: '0.12s',
    exitX: '420px',
    exitY: '-250px',
    exitRotate: '12deg',
  },
  {
    offsetX: '-210px',
    offsetY: '110px',
    rotate: '10deg',
    delay: '0.25s',
    exitX: '-420px',
    exitY: '360px',
    exitRotate: '24deg',
  },
  {
    offsetX: '220px',
    offsetY: '140px',
    rotate: '-8deg',
    delay: '0.38s',
    exitX: '460px',
    exitY: '320px',
    exitRotate: '-14deg',
  },
  {
    offsetX: '0px',
    offsetY: '-220px',
    rotate: '4deg',
    delay: '0.5s',
    exitX: '0px',
    exitY: '-450px',
    exitRotate: '6deg',
  },
  {
    offsetX: '40px',
    offsetY: '220px',
    rotate: '12deg',
    delay: '0.62s',
    exitX: '220px',
    exitY: '460px',
    exitRotate: '18deg',
  },
];

const LOADER_LAYOUT_MOBILE = [
  {
    offsetX: '-110px',
    offsetY: '-100px',
    rotate: '-12deg',
    delay: '0s',
    exitX: '-280px',
    exitY: '-210px',
    exitRotate: '-18deg',
  },
  {
    offsetX: '140px',
    offsetY: '-110px',
    rotate: '6deg',
    delay: '0.12s',
    exitX: '320px',
    exitY: '-150px',
    exitRotate: '12deg',
  },
  {
    offsetX: '-120px',
    offsetY: '80px',
    rotate: '10deg',
    delay: '0.25s',
    exitX: '-320px',
    exitY: '250px',
    exitRotate: '24deg',
  },
  {
    offsetX: '150px',
    offsetY: '120px',
    rotate: '-8deg',
    delay: '0.38s',
    exitX: '340px',
    exitY: '240px',
    exitRotate: '-14deg',
  },
  {
    offsetX: '0px',
    offsetY: '-150px',
    rotate: '4deg',
    delay: '0.5s',
    exitX: '0px',
    exitY: '-330px',
    exitRotate: '6deg',
  },
  {
    offsetX: '30px',
    offsetY: '150px',
    rotate: '12deg',
    delay: '0.62s',
    exitX: '200px',
    exitY: '360px',
    exitRotate: '18deg',
  },
];

function App() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'scattered' | 'list'
  const [activeCategories, setActiveCategories] = useState([]); // Array for multi-select
  const [acquisition, setAcquisition] = useState('All');
  const [color, setColor] = useState('All');
  const [country, setCountry] = useState('All');
  const [openDropdown, setOpenDropdown] = useState(null); // 'acquisition' | 'color' | 'country' | null
  const [resultCount, setResultCount] = useState(0);
  const [sortMethod, setSortMethod] = useState('vibes');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);
  const sortMenuRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [loaderLayout, setLoaderLayout] = useState(LOADER_LAYOUT);
  const loaderPhotos = useMemo(() => {
    const shuffled = [...galleryImages].sort(() => Math.random() - 0.5);
    const isMobileLayout = loaderLayout === LOADER_LAYOUT_MOBILE;
    return loaderLayout.map((layout, index) => {
      const image = shuffled[index % shuffled.length];
      return {
        ...layout,
        src: image?.src ?? galleryImages[index % galleryImages.length]?.src ?? '',
        width: '150px',
        height: '150px',
        scale: isMobileLayout ? 0.9 : 1,
      };
    });
  }, [loaderLayout]);
  const showSortControls = viewMode === 'grid' || viewMode === 'list';

  const categories = ['Live', 'Work', 'Play', 'Eat', 'Wear', 'Care'];
  const acquisitionOptions = ['All', 'Bought', 'Gifted', 'Earned'];
  const colorOptions = ['All', 'White', 'Black', 'Brown', 'Blue', 'Green', 'Red', 'Yellow', 'Orange', 'Gold', 'Beige', 'Grey', 'Pink', 'Purple', 'Multicolor'];
  const countryOptions = ['All', 'India', 'USA', 'Japan', 'France', 'Singapore', 'Sri Lanka', 'Czech Republic'];

  const filterRef = useRef(null);
  const sheetRef = useRef(null);
  const dropdownTitles = {
    categories: 'Categories',
    acquisition: 'Source',
    color: 'Color',
    country: 'Country',
  };

  const currentModeConfig = viewModes.find((mode) => mode.key === viewMode) ?? viewModes[0];
  const CurrentModeIcon = currentModeConfig.Icon;

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const toggleMobileMode = () => {
    setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  const handleSortToggle = () => {
    setSortMenuOpen((prev) => !prev);
  };

  const handleSortSelect = (value) => {
    setSortMethod(value);
    setSortMenuOpen(false);
  };

  useEffect(() => {
    let hideTimer;
    const exitTimer = setTimeout(() => {
      setIsLoaderExiting(true);
      hideTimer = setTimeout(() => {
        setIsLoading(false);
      }, LOADER_EXIT_DURATION_MS);
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleTitleInteraction = () => {
    if (!isDesktop) {
      return;
    }
    setIsAboutModalOpen(true);
  };

  const handleTitleKeyDown = (event) => {
    if (!isDesktop) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space' || event.key === 'Spacebar') {
      event.preventDefault();
      setIsAboutModalOpen(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideFilter = filterRef.current && filterRef.current.contains(event.target);
      const clickedInsideSheet = sheetRef.current && sheetRef.current.contains(event.target);
      if (!clickedInsideFilter && !clickedInsideSheet) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    if (!showSortControls) {
      setSortMenuOpen(false);
    }
  }, [showSortControls]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const userAgent = navigator.userAgent;
    const isSafari = userAgent.includes('Safari') && !/(Chrome|Chromium|CriOS|FxiOS)/i.test(userAgent);
    if (!isSafari) {
      return undefined;
    }

    const root = document.documentElement;
    root.style.setProperty('--carousel-duration', '110s');
    return () => {
      root.style.removeProperty('--carousel-duration');
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
      const preferredLayout = window.innerWidth < 768 ? LOADER_LAYOUT_MOBILE : LOADER_LAYOUT;
      setLoaderLayout((prev) => (prev === preferredLayout ? prev : preferredLayout));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop && isAboutModalOpen) {
      setIsAboutModalOpen(false);
    }
  }, [isDesktop, isAboutModalOpen]);

  useEffect(() => {
    if (!isAboutModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsAboutModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAboutModalOpen]);

  useEffect(() => {
    if (!isAboutModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isAboutModalOpen]);

  const toggleCategory = (cat) => {
    setActiveCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat)  // Remove if already selected
        : [...prev, cat]                // Add if not selected
    );
  };

  const handleMobileSelect = (dropdown, value) => {
    if (dropdown === 'categories') {
      toggleCategory(value);
      return;
    }

    if (dropdown === 'acquisition') {
      setAcquisition(value);
    } else if (dropdown === 'color') {
      setColor(value);
    } else if (dropdown === 'country') {
      setCountry(value);
    }

    setOpenDropdown(null);
  };

  const renderMobileDropdownOptions = () => {
    if (!openDropdown) {
      return null;
    }

    if (openDropdown === 'categories') {
      return categories.map((cat) => {
        const IconComponent = categoryIcons[cat];
        return (
          <button
            key={`mobile-category-${cat}`}
            type="button"
            className={`dropdown-item mobile-dropdown-item ${activeCategories.includes(cat) ? 'active' : ''}`}
            onClick={() => handleMobileSelect('categories', cat)}
          >
            {IconComponent && (
              <span className="mobile-dropdown-item__icon">
                <IconComponent width={18} height={18} strokeWidth={1.8} />
              </span>
            )}
            <span>{cat}</span>
          </button>
        );
      });
    }

    if (openDropdown === 'acquisition') {
      return acquisitionOptions.map((option) => (
        <button
          key={`mobile-acquisition-${option}`}
          type="button"
          className={`dropdown-item mobile-dropdown-item ${acquisition === option ? 'active' : ''}`}
          onClick={() => handleMobileSelect('acquisition', option)}
        >
          {option}
        </button>
      ));
    }

    if (openDropdown === 'color') {
      return colorOptions.map((option) => (
        <button
          key={`mobile-color-${option}`}
          type="button"
          className={`dropdown-item mobile-dropdown-item ${color === option ? 'active' : ''}`}
          onClick={() => handleMobileSelect('color', option)}
        >
          {option !== 'All' && (
            <span
              className="color-dot"
              style={{ background: colorHex[option] }}
            />
          )}
          {option}
        </button>
      ));
    }

    if (openDropdown === 'country') {
      return countryOptions.map((option) => (
        <button
          key={`mobile-country-${option}`}
          type="button"
          className={`dropdown-item mobile-dropdown-item ${country === option ? 'active' : ''}`}
          onClick={() => handleMobileSelect('country', option)}
        >
          {option !== 'All' && `${countryFlags[option]}  `}
          {option}
        </button>
      ));
    }

    return null;
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
      {isLoading && (
        <div
          className={`loader-overlay${isLoaderExiting ? ' loader-overlay--exiting' : ''}`}
          role="status"
          aria-live="polite"
        >
          {loaderPhotos.map((photo) => (
            <div
              key={`${photo.src}-${photo.delay}`}
              className="loader-piece"
              style={{
                backgroundImage: `url(${photo.src})`,
                '--offset-x': photo.offsetX,
                '--offset-y': photo.offsetY,
                '--rotate': photo.rotate,
                '--delay': photo.delay,
                '--piece-width': photo.width,
                '--piece-height': photo.height,
                '--piece-scale': photo.scale ?? 1,
              '--exit-x': photo.exitX,
              '--exit-y': photo.exitY,
              '--exit-rotate': photo.exitRotate,
              }}
            />
          ))}
        </div>
      )}
      {isDesktop && isAboutModalOpen && (
        <AboutModal
          onClose={() => setIsAboutModalOpen(false)}
          viewMode={viewMode}
          featured={FEATURED_MODAL_IMAGES}
        />
      )}
      <header className="header">
        <div className="header-left">
        <h1
          className="site-title"
          tabIndex={0}
          role="button"
          aria-controls="about-modal-title"
          aria-expanded={isAboutModalOpen}
          onClick={handleTitleInteraction}
          onKeyDown={handleTitleKeyDown}
        >
          {isDesktop ? (
            'Beautifully Designed Objects'
          ) : (
            <>
              <span>Beautifully</span>
              <span>Designed</span>
              <span>Objects</span>
            </>
          )}
        </h1>
        </div>
        
        <div className="header-right">
          <div className="view-toggles">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              data-tooltip="Grid view"
            >
              <DotsGrid3x3 width={16} height={16} strokeWidth={2} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'scattered' ? 'active' : ''}`}
              onClick={() => setViewMode('scattered')}
              aria-label="Canvas view"
              data-tooltip="Canvas view"
            >
              <FrameAltEmpty width={16} height={16} strokeWidth={2} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              data-tooltip="List view"
            >
              <MenuScale width={16} height={16} strokeWidth={2} />
            </button>
          </div>
          <div className="mobile-view-wrapper">
            <button
              type="button"
              className="mobile-mode-btn"
              onClick={toggleMobileMode}
              aria-label="Toggle between grid and list view"
            >
              <CurrentModeIcon width={20} height={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <div className="filter-bar">
        <div className="filter-section" ref={filterRef}>
          <div className="category-pill-group">
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
          </div>

          <div className="filter-dropdown-wrapper category-dropdown-mobile">
            <button
              type="button"
              className={`filter-dropdown category-dropdown-trigger ${openDropdown === 'categories' ? 'active' : ''}`}
              onClick={() => toggleDropdown('categories')}
            >
              <span>{activeCategories.length ? `${activeCategories.length} selected` : 'Categories'}</span>
              <NavArrowDown
                width={16}
                height={16}
                strokeWidth={1.8}
                className={`category-chevron ${openDropdown === 'categories' ? 'open' : ''}`}
              />
            </button>
            {openDropdown === 'categories' && (
              <div className="dropdown-menu category-dropdown-menu">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`dropdown-item ${activeCategories.includes(cat) ? 'active' : ''}`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

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

      </div>
      {!isDesktop && openDropdown && (
        <>
          <div
            className="dropdown-backdrop"
            aria-hidden="true"
            onClick={() => setOpenDropdown(null)}
          />
          <div
            ref={sheetRef}
            className="mobile-dropdown-sheet"
            role="dialog"
            aria-modal="true"
          >
            <div className="mobile-dropdown-sheet__header">
              <div className="mobile-dropdown-sheet__title">
                {dropdownTitles[openDropdown] ?? 'Options'}
              </div>
              <button
                type="button"
                className="mobile-dropdown-sheet__close"
                onClick={() => setOpenDropdown(null)}
                aria-label="Close filters"
              >
                <Xmark width={18} height={18} strokeWidth={1.8} color="currentColor" />
              </button>
            </div>
            <div className="mobile-dropdown-sheet__options">
              {renderMobileDropdownOptions()}
            </div>
            {openDropdown === 'categories' && (
              <div className="mobile-dropdown-sheet__cta">
                <button
                  type="button"
                  className="mobile-dropdown-sheet__cta-btn"
                  onClick={() => setOpenDropdown(null)}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <main>
        <div className="canvas-meta">
          <span className="result-count">
            {resultCount} {resultCount === 1 ? 'object' : 'objects'}
          </span>
          {showSortControls && (
            <>
              <span className="meta-divider" aria-hidden="true">•</span>
              <div className="sort-selector" ref={sortMenuRef}>
                <button
                  type="button"
                  className="sort-trigger"
                  onClick={handleSortToggle}
                  aria-haspopup="true"
                  aria-expanded={sortMenuOpen}
                >
                  <span className="sort-label">
                    SORT BY 
                    <span className="sort-value">
                      {sortOptions.find((option) => option.value === sortMethod)?.label ?? 'Curated'}
                    </span>
                  </span>
                  <NavArrowDown
                    width={14}
                    height={14}
                    strokeWidth={1.8}
                    color="currentColor"
                    className={`sort-chevron ${sortMenuOpen ? 'open' : ''}`}
                  />
                </button>

                {sortMenuOpen && (
                  <div className="sort-menu">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`sort-menu-item ${sortMethod === option.value ? 'active' : ''}`}
                        onClick={() => handleSortSelect(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <Gallery 
          viewMode={viewMode} 
          activeCategories={activeCategories}
          acquisition={acquisition}
          color={color}
          country={country}
          onResultsChange={setResultCount}
          sortMethod={sortMethod}
          onClearFilters={clearFilters}
        />
      </main>
      <footer className="page-footer">
        <div className="page-footer-credit">
          Made with love by{' '}
          <a
            className="page-footer-link"
            href="https://x.com/charmiekapoor"
            target="_blank"
            rel="noreferrer"
          >
            <span className="page-footer-link-avatar" aria-hidden="true" />
            Charmie Kapoor
          </a>.
        </div>
        <a
          className="page-footer-note"
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          rel="noreferrer"
        >
          Get one object for free!
        </a>
      </footer>
    </div>
  );
}

export default App;
