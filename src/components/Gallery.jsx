import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useVelocity } from 'framer-motion';
import { galleryImages } from '../data/images';
import ImageModal from './ImageModal';
import './Gallery.css';

// Configuration
const MAX_IMAGES = 64;

// Conversion rates to INR (approximate)
const conversionRates = {
  USD: 84,
  EUR: 91,
  GBP: 106,
  JPY: 0.56,
  LKR: 0.26,
};

// Format number with commas for Indian numbering
const formatINR = (num) => {
  return num.toLocaleString('en-IN');
};

// Format price as "<currency symbol><amount>" with INR conversion
const formatPrice = (price, showConversion = true) => {
  if (!price) return '';
  
  // Handle different formats
  const priceStr = price.toString().trim();
  
  // Rs.3699 or Rs 3699 → ₹3699 (already in INR)
  if (priceStr.toLowerCase().startsWith('rs')) {
    const amount = priceStr.replace(/rs\.?\s*/i, '').replace(/,/g, '').trim();
    return `₹${amount}`;
  }
  
  // $16 → $16 (₹1,344)
  if (priceStr.startsWith('$')) {
    const amount = parseFloat(priceStr.replace('$', '').replace(/,/g, '').trim());
    const inrAmount = Math.round(amount * conversionRates.USD);
    return showConversion ? { main: `$${amount}`, converted: `₹${formatINR(inrAmount)}` } : `$${amount}`;
  }
  
  // €72 → €72 (₹6,552)
  if (priceStr.startsWith('€')) {
    const amount = parseFloat(priceStr.replace('€', '').replace(/,/g, '').trim());
    const inrAmount = Math.round(amount * conversionRates.EUR);
    return showConversion ? { main: `€${amount}`, converted: `₹${formatINR(inrAmount)}` } : `€${amount}`;
  }
  
  // £50 → £50 (₹5,300)
  if (priceStr.startsWith('£')) {
    const amount = parseFloat(priceStr.replace('£', '').replace(/,/g, '').trim());
    const inrAmount = Math.round(amount * conversionRates.GBP);
    return showConversion ? { main: `£${amount}`, converted: `₹${formatINR(inrAmount)}` } : `£${amount}`;
  }
  
  // 2000 yen → ¥2000 (₹1,120)
  if (priceStr.toLowerCase().includes('yen')) {
    const amount = parseFloat(priceStr.toLowerCase().replace('yen', '').replace(/,/g, '').trim());
    const inrAmount = Math.round(amount * conversionRates.JPY);
    return showConversion ? { main: `¥${amount}`, converted: `₹${formatINR(inrAmount)}` } : `¥${amount}`;
  }
  
  // 2000 LKR → LKR 2000 (₹520)
  if (priceStr.toLowerCase().includes('lkr')) {
    const amount = parseFloat(priceStr.toLowerCase().replace('lkr', '').replace(/,/g, '').trim());
    const inrAmount = Math.round(amount * conversionRates.LKR);
    return showConversion ? { main: `LKR ${amount}`, converted: `₹${formatINR(inrAmount)}` } : `LKR ${amount}`;
  }
  
  return priceStr;
};

const FALLBACK_POSITION = {
  top: 50,
  left: 48,
  width: '32%',
  rotate: 0,
  zIndex: 1,
};

// Grid Item Component
function GridItem({ image, onClick }) {
  const priceData = image.price ? formatPrice(image.price) : null;
  
  return (
    <article
      className="grid-item"
      onClick={() => onClick(image)}
    >
      <div className="grid-image-wrapper">
        <img 
          src={image.src} 
          alt={image.name || `Item ${image.id}`} 
          loading="lazy"
          draggable="false"
        />
      </div>
      {image.name && (
        <div className="grid-item-info">
          <span className="grid-item-name">{image.name}</span>
          {priceData && (
            <span className="grid-item-price">
              {typeof priceData === 'object' ? (
                <>
                  {priceData.main} <span className="price-converted">({priceData.converted})</span>
                </>
              ) : priceData}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

// List Item Component - Minimal row-based layout
function ListItem({ image, onClick, isLast }) {
  const priceData = image.price ? formatPrice(image.price) : null;
  
  return (
    <article
      className={`list-item ${isLast ? 'last' : ''}`}
      onClick={() => onClick(image)}
    >
      <div className="list-item-left">
        <div className="list-item-image">
          <img 
            src={image.src} 
            alt={image.name || `Item ${image.id}`} 
            loading="lazy"
            draggable="false"
          />
        </div>
        <span className="list-item-name">{image.name || `Item ${image.id}`}</span>
      </div>
      <span className="list-item-price">
        {priceData ? (
          typeof priceData === 'object' && priceData.converted ? (
            <>
              <span className="price-converted">{priceData.converted}</span> {priceData.main}
            </>
          ) : (typeof priceData === 'object' ? priceData.main : priceData)
        ) : '—'}
      </span>
    </article>
  );
}

// Generate organic scattered positions without overlapping
const generatePositions = (count) => {
  const positions = [];
  const actualCount = Math.min(count, MAX_IMAGES);
  const rotations = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  
  // Seeded random for consistent layout
  let seed = 42;
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const width = window.innerWidth;
  const isMobile = width <= 480;
  const isTablet = width <= 768;

  // Adjust columns and width based on device
  const columns = isMobile ? 1 : (isTablet ? 2 : 4);
  const imageWidthBase = isMobile ? 80 : (isTablet ? 40 : 18);
  
  const getWidthForPosition = () => {
    return imageWidthBase; // Percentage of viewport width
  };
  
  const totalRows = Math.ceil(actualCount / columns);
  const colWidth = 100 / columns;

  for (let i = 0; i < actualCount; i++) {
    const row = Math.floor(i / columns);
    const col = i % columns;
    
    // Base position in the grid - top is now a simple percentage of total height
    const baseLeft = col * colWidth + (colWidth / 2);
    const baseTop = (row / totalRows) * 100 + (100 / totalRows / 4);
    
    // Controlled scatter
    const scatterX = (seededRandom() - 0.5) * (colWidth * (isMobile ? 0.1 : 0.4));
    const scatterY = (seededRandom() - 0.5) * (100 / totalRows * 0.5);
    
    const left = Math.max(isMobile ? 10 : 5, Math.min(isMobile ? 90 : 95, baseLeft + scatterX));
    const top = baseTop + scatterY;
    
    const rotate = rotations[Math.floor(seededRandom() * rotations.length)];
    const widthNum = getWidthForPosition();

    positions.push({
      top,
      left: left - (widthNum / 2), 
      width: `${widthNum}%`,
      widthNum,
      rotate,
      zIndex: Math.floor(seededRandom() * 3) + 1
    });
  }
  
  return positions;
};

function ParallaxItem({ image, position, index, dragging, onMouseDown, onTouchStart, onClick }) {
  const isDragging = dragging === image.id;
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Scroll velocity for motion blur and stretch
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Transform absolute velocity to blur amount (0 to 1.2px)
  const blurValue = useTransform(
    scrollVelocity, 
    [-4000, 0, 4000], 
    [1.2, 0, 1.2]
  );
  
  // Transform velocity to vertical stretch (1 to 1.04)
  const stretchValue = useTransform(
    scrollVelocity,
    [-4000, 0, 4000],
    [1.04, 1, 1.04]
  );

  // Transform velocity to horizontal squash (1 to 0.97)
  const squashValue = useTransform(
    scrollVelocity,
    [-4000, 0, 4000],
    [0.97, 1, 0.97]
  );
  
  // Smooth the transitions - higher damping for less "elastic" feel
  const smoothBlur = useSpring(blurValue, { damping: 50, stiffness: 400 });
  const smoothStretch = useSpring(stretchValue, { damping: 45, stiffness: 300 });
  const smoothSquash = useSpring(squashValue, { damping: 45, stiffness: 300 });

  // Convert blur number to filter string
  const filter = useTransform(smoothBlur, (v) => `blur(${v}px)`);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Constant strength for all images
  const strength = 7.5;
  const springConfig = { damping: 20, stiffness: 200 };
  
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [strength, -strength]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [strength, -strength]), springConfig);

  return (
    <motion.article
      key={image.id}
      className={`scattered-item ${isDragging ? 'dragging' : ''}`}
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        width: position.width,
        zIndex: position.zIndex,
        rotate: position.rotate,
        x: isDragging ? 0 : translateX,
        y: isDragging ? 0 : translateY,
        scaleX: isDragging ? 1.05 : smoothSquash,
        scaleY: isDragging ? 1.05 : smoothStretch,
        filter: isDragging ? 'none' : filter,
        willChange: 'filter, transform'
      }}
      onMouseDown={(e) => onMouseDown(e, image.id)}
      onTouchStart={(e) => onTouchStart && onTouchStart(e, image.id)}
      onClick={() => onClick(image)}
    >
      <motion.div 
        className="scattered-image-wrapper"
        animate={isDragging ? { y: 0, scale: 1 } : {
          y: [0, -6, -6, 0],
          scale: [1, 1.015, 1.015, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.45, 0.55, 1],
          delay: index * 0.2,
        }}
      >
        <img 
          src={image.src} 
          alt={image.name || `Item ${image.id}`} 
          loading="lazy"
          draggable="false"
        />
      </motion.div>
    </motion.article>
  );
}

function Gallery({ viewMode = 'grid', activeCategories = [], acquisition = 'All', color = 'All', country = 'All' }) {
  const baseGalleryImages = useMemo(() => galleryImages.slice(0, MAX_IMAGES), []);

  const displayedImages = useMemo(() => {
    return baseGalleryImages.filter(image => {
      if (activeCategories.length > 0 && !activeCategories.includes(image.category)) {
        return false;
      }

      if (acquisition !== 'All' && image.howAcquired?.toLowerCase() !== acquisition.toLowerCase()) {
        return false;
      }

      if (color !== 'All') {
        const imageColors = image.color?.toLowerCase() || '';
        if (!imageColors.includes(color.toLowerCase())) {
          return false;
        }
      }

      if (country !== 'All' && image.from !== country) {
        return false;
      }

      return true;
    });
  }, [baseGalleryImages, activeCategories, acquisition, color, country]);
  
  const [positions, setPositions] = useState(() => {
    const generated = generatePositions(displayedImages.length);
    return displayedImages.map((img, index) => ({
      ...generated[index],
      id: img.id,
    }));
  });

  const regeneratePositions = useCallback(() => {
    const generated = generatePositions(displayedImages.length);
    setPositions(displayedImages.map((img, index) => ({
      ...generated[index],
      id: img.id,
    })));
  }, [displayedImages]);

  useEffect(() => {
    regeneratePositions();
  }, [regeneratePositions]);

  useEffect(() => {
    window.addEventListener('resize', regeneratePositions);
    return () => window.removeEventListener('resize', regeneratePositions);
  }, [regeneratePositions]);

  const [selectedImage, setSelectedImage] = useState(null);

  const fallbackPositions = useMemo(() => generatePositions(displayedImages.length), [displayedImages.length]);

  const positionsById = useMemo(() => {
    const map = new Map();
    positions.forEach(pos => {
      if (pos?.id != null) {
        map.set(pos.id, pos);
      }
    });
    return map;
  }, [positions]);

  const [dragging, setDragging] = useState(null);
  const [maxZIndex, setMaxZIndex] = useState(100);
  
  const dragRef = useRef({ startX: 0, startY: 0, startLeft: 0, startTop: 0 });
  const containerRef = useRef(null);
  const hasDragged = useRef(false);

  const handleMouseDown = useCallback((e, imageId) => {
    // Only prevent default for left-click to avoid interfering with touch events
    if (e.button === 0) {
      e.preventDefault();
    }
    e.stopPropagation();
    hasDragged.current = false;
    
    const pos = positions.find(p => p.id === imageId);
    const container = containerRef.current;
    if (!container || !pos) return;
    
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: pos.left,
      startTop: pos.top,
    };
    
    setMaxZIndex(prev => prev + 1);
    setPositions(prev => prev.map(p => 
      p.id === imageId ? { ...p, zIndex: maxZIndex + 1 } : p
    ));
    
    setDragging(imageId);
  }, [positions, maxZIndex]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasDragged.current = true;
    }
    
    const deltaLeftPercent = (deltaX / rect.width) * 100;
    const deltaTopPercent = (deltaY / rect.height) * 100;
    
    const newLeft = dragRef.current.startLeft + deltaLeftPercent;
    const newTop = dragRef.current.startTop + deltaTopPercent;

    setPositions(prev => prev.map(p => 
      p.id === dragging 
        ? { ...p, left: newLeft, top: newTop }
        : p
    ));
  }, [dragging]);

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e, imageId) => {
    e.stopPropagation();
    hasDragged.current = false;
    
    const touch = e.touches[0];
    const pos = positions.find(p => p.id === imageId);
    const container = containerRef.current;
    if (!container || !pos) return;
    
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startLeft: pos.left,
      startTop: pos.top,
    };
    
    setMaxZIndex(prev => prev + 1);
    setPositions(prev => prev.map(p => 
      p.id === imageId ? { ...p, zIndex: maxZIndex + 1 } : p
    ));
    
    setDragging(imageId);
  }, [positions, maxZIndex]);

  const handleTouchMove = useCallback((e) => {
    if (!dragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    
    const deltaX = touch.clientX - dragRef.current.startX;
    const deltaY = touch.clientY - dragRef.current.startY;
    
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasDragged.current = true;
    }
    
    const deltaLeftPercent = (deltaX / rect.width) * 100;
    const deltaTopPercent = (deltaY / rect.height) * 100;
    
    const newLeft = dragRef.current.startLeft + deltaLeftPercent;
    const newTop = dragRef.current.startTop + deltaTopPercent;

    setPositions(prev => prev.map(p => 
      p.id === dragging 
        ? { ...p, left: newLeft, top: newTop }
        : p
    ));
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleImageClick = useCallback((image) => {
    // Only open modal if we didn't drag (for scattered view)
    if (viewMode === 'scattered' && hasDragged.current) {
      return;
    }
    setSelectedImage(image);
  }, [viewMode]);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleNavigate = useCallback((direction) => {
    if (!selectedImage) return;
    const currentIndex = displayedImages.findIndex(img => img.id === selectedImage.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : displayedImages.length - 1;
    } else {
      newIndex = currentIndex < displayedImages.length - 1 ? currentIndex + 1 : 0;
    }
    setSelectedImage(displayedImages[newIndex]);
  }, [selectedImage, displayedImages]);

  // Grid View
  if (viewMode === 'grid') {
    return (
      <>
        <section className="grid-gallery">
          {displayedImages.map((image) => (
            <GridItem
              key={image.id}
              image={image}
              onClick={handleImageClick}
            />
          ))}
        </section>

        {selectedImage && (
          <ImageModal 
            image={selectedImage} 
            onClose={handleCloseModal}
            images={displayedImages}
            onNavigate={handleNavigate}
          />
        )}
      </>
    );
  }

  // List View - Minimal rows with dividers
  if (viewMode === 'list') {
    return (
      <>
        <section className="list-gallery">
          {displayedImages.map((image, index) => (
            <ListItem
              key={image.id}
              image={image}
              onClick={handleImageClick}
              isLast={index === displayedImages.length - 1}
            />
          ))}
        </section>

        {selectedImage && (
          <ImageModal 
            image={selectedImage} 
            onClose={handleCloseModal}
            images={displayedImages}
            onNavigate={handleNavigate}
          />
        )}
      </>
    );
  }

  // Scattered View (default fallback)
  return (
    <>
      <section 
        className="scattered-gallery"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {displayedImages.map((image, index) => {
          const fallback = fallbackPositions[index] || fallbackPositions[0] || FALLBACK_POSITION;
          const position = positionsById.get(image.id) ?? fallback;
          
          return (
            <ParallaxItem
              key={image.id}
              image={image}
              position={position}
              index={index}
              dragging={dragging}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onClick={handleImageClick}
            />
          );
        })}
      </section>

      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={handleCloseModal}
          images={displayedImages}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}

export default Gallery;
