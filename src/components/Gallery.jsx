import { useState, useRef, useCallback } from 'react';
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
    // Larger in center (14-16%), smaller at edges (7-9%)
    const minWidth = 7 + seededRandom() * 2;
    const maxWidth = 14 + seededRandom() * 2;
    const width = maxWidth - (normalizedDistance * (maxWidth - minWidth));
    return Math.round(width);
  };
  
  // Collision detection - check if new position overlaps with existing
  const checkCollision = (newPos, existing) => {
    const padding = 2; // % padding between images
    for (const pos of existing) {
      const overlapX = Math.abs(newPos.left - pos.left) < (newPos.widthNum + pos.widthNum) / 2 + padding;
      const overlapY = Math.abs(newPos.top - pos.top) < 5 + padding; // assume ~5% height per image
      if (overlapX && overlapY) return true;
    }
    return false;
  };
  
  // Place images with organic flow - zigzag pattern with randomness
  let currentTop = 2;
  let direction = 1; // 1 = moving right, -1 = moving left
  let currentLeft = 5;
  
  for (let i = 0; i < actualCount; i++) {
    const rotate = rotations[Math.floor(seededRandom() * rotations.length)];
    
    // Try to find a non-overlapping position
    let attempts = 0;
    let finalPos = null;
    
    while (attempts < 50) {
      // Organic flow: zigzag down the page with randomness
      const randomOffsetX = (seededRandom() - 0.5) * 15;
      const randomOffsetY = (seededRandom() - 0.5) * 2;
      
      const testLeft = Math.max(2, Math.min(85, currentLeft + randomOffsetX));
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
      
      // If collision, try nearby positions
      currentLeft += (seededRandom() - 0.3) * 20 * direction;
      if (currentLeft > 80 || currentLeft < 5) {
        direction *= -1;
        currentTop += 4 + seededRandom() * 2;
        currentLeft = direction > 0 ? 5 + seededRandom() * 10 : 75 - seededRandom() * 10;
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
    currentLeft += (15 + seededRandom() * 12) * direction;
    
    // Bounce off edges and move down
    if (currentLeft > 78 || currentLeft < 8) {
      direction *= -1;
      currentTop += 5 + seededRandom() * 3;
      currentLeft = direction > 0 ? 5 + seededRandom() * 8 : 78 - seededRandom() * 8;
    }
  }
  
  return positions;
};

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
        const isDragging = dragging === image.id;
        
        return (
          <article
            key={image.id}
            className={`scattered-item ${isDragging ? 'dragging' : ''}`}
            style={{
              top: `${position.top}%`,
              left: `${position.left}%`,
              width: position.width,
              zIndex: position.zIndex,
              transform: isDragging 
                ? `rotate(${position.rotate}deg) scale(1.05)` 
                : `rotate(${position.rotate}deg)`,
            }}
            onMouseDown={(e) => handleMouseDown(e, image.id)}
            onClick={() => handleImageClick(image)}
          >
            <div className="scattered-image-wrapper">
              <img 
                src={image.src} 
                alt={image.title} 
                loading="lazy"
                draggable="false"
              />
            </div>
          </article>
        );
      })}

    </section>
  );
}

export default Gallery;
