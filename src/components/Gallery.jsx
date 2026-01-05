import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useVelocity } from 'framer-motion';
import { galleryImages } from '../data/images';
import './Gallery.css';

// Configuration
const MAX_IMAGES = 64;

// Generate organic scattered positions without overlapping
const generatePositions = (count) => {
  const positions = [];
  const actualCount = Math.min(count, MAX_IMAGES);
  const rotations = [-12, -8, -5, -3, 0, 3, 5, 8, 12];
  
  // Seeded random for consistent layout
  let seed = 42;
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  
  // Calculate width based on distance from center - larger in center, smaller at edges
  const getWidthForPosition = (leftPos) => {
    // Center is at 50%, calculate distance from center (0-50)
    const distanceFromCenter = Math.abs(leftPos - 50);
    // Normalize to 0-1 (0 = center, 1 = edge)
    const normalizedDistance = distanceFromCenter / 50;
    // Larger in center (~18-21%), smaller at edges (~9-12%) - increased by ~1.3x
    const minWidth = 10 + seededRandom() * 2;
    const maxWidth = 19 + seededRandom() * 3;
    const width = maxWidth - (normalizedDistance * (maxWidth - minWidth));
    return Math.round(width);
  };
  
  // Collision detection - check if new position overlaps with existing
  const checkCollision = (newPos, existing) => {
    const paddingX = 3; // % padding between images horizontally
    const paddingY = 2; // % padding between images vertically
    for (const pos of existing) {
      const overlapX = Math.abs(newPos.left - pos.left) < (newPos.widthNum + pos.widthNum) / 2 + paddingX;
      // Assume average height is ~9% (width 15% * aspect ratio)
      const overlapY = Math.abs(newPos.top - pos.top) < 9 + paddingY;
      if (overlapX && overlapY) return true;
    }
    return false;
  };
  
  // Place images with organic flow - zigzag pattern with randomness
  let currentTop = 3;
  let direction = 1; // 1 = moving right, -1 = moving left
  let currentLeft = 8;
  
  for (let i = 0; i < actualCount; i++) {
    const rotate = rotations[Math.floor(seededRandom() * rotations.length)];
    
    // Try to find a non-overlapping position
    let attempts = 0;
    let finalPos = null;
    
    while (attempts < 100) {
      // Organic flow: zigzag down the page with randomness
      const randomOffsetX = (seededRandom() - 0.5) * 8;
      const randomOffsetY = (seededRandom() - 0.5) * 1;
      
      const testLeft = Math.max(5, Math.min(75, currentLeft + randomOffsetX));
      const widthNum = getWidthForPosition(testLeft);
      
      const testPos = {
        top: currentTop + randomOffsetY,
        left: testLeft,
        widthNum,
      };
      
      if (!checkCollision(testPos, positions)) {
        finalPos = testPos;
        break;
      }
      attempts++;
      
      // If collision, try moving further along the path
      currentLeft += 4 * direction;
      if (currentLeft > 75 || currentLeft < 5) {
        direction *= -1;
        currentTop += 4 + seededRandom() * 2;
        currentLeft = direction > 0 ? 8 + seededRandom() * 5 : 72 - seededRandom() * 5;
      }
    }
    
    // Fallback if no position found
    if (!finalPos) {
      const widthNum = getWidthForPosition(currentLeft);
      finalPos = {
        top: currentTop,
        left: currentLeft,
        widthNum,
      };
    }
    
    positions.push({
      top: finalPos.top,
      left: finalPos.left,
      width: `${finalPos.widthNum}%`,
      widthNum: finalPos.widthNum,
      rotate,
      zIndex: Math.floor(seededRandom() * 3) + 1,
    });
    
    // Move to next position with organic flow
    currentLeft += (16 + seededRandom() * 8) * direction;
    
    // Bounce off edges and move down
    if (currentLeft > 72 || currentLeft < 8) {
      direction *= -1;
      currentTop += 7 + seededRandom() * 3;
      currentLeft = direction > 0 ? 8 + seededRandom() * 10 : 72 - seededRandom() * 10;
    }
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
          alt={image.title} 
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

  const handleImageClick = () => {
    // Do nothing on tap for now
  };

  return (
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
  );
}

export default Gallery;
