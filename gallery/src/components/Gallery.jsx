import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useVelocity } from 'framer-motion';
import { galleryImages } from '../data/images';
import ImageModal from './ImageModal';
import './Gallery.css';

// Configuration
const MAX_IMAGES = 64;

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
      zIndex: Math.floor(seededRandom() * 3) + 1,
      id: galleryImages[i].id
    });
  }
  
  return positions;
};

function ParallaxItem({ image, position, index, dragging, onMouseDown, onClick }) {
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

function Gallery() {
  // Limit to MAX_IMAGES (64 images across 4 folds)
  const displayedImages = galleryImages.slice(0, MAX_IMAGES);
  
  const [positions, setPositions] = useState(() => {
    const generated = generatePositions(displayedImages.length);
    return displayedImages.map((img, index) => ({
      ...generated[index],
      id: img.id,
    }));
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const generated = generatePositions(displayedImages.length);
      setPositions(displayedImages.map((img, index) => ({
        ...generated[index],
        id: img.id,
      })));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [displayedImages.length]);

  const [dragging, setDragging] = useState(null);
  const [maxZIndex, setMaxZIndex] = useState(100);
  
  const dragRef = useRef({ startX: 0, startY: 0, startLeft: 0, startTop: 0 });
  const containerRef = useRef(null);
  const hasDragged = useRef(false);

  const handleMouseDown = useCallback((e, imageId) => {
    e.preventDefault();
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

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleImageClick = useCallback((image) => {
    // Only open modal if we didn't drag
    if (!hasDragged.current) {
      setSelectedImage(image);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return (
    <>
      <section 
        className="scattered-gallery"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {displayedImages.map((image, index) => {
          const position = positions.find(p => p.id === image.id) || positions[index];
          
          return (
            <ParallaxItem
              key={image.id}
              image={image}
              position={position}
              index={index}
              dragging={dragging}
              onMouseDown={handleMouseDown}
              onClick={handleImageClick}
            />
          );
        })}
      </section>

      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
}

export default Gallery;
