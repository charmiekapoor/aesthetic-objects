import { useState, useRef, useCallback, useEffect } from 'react';
import ImageModal from './ImageModal';
import { galleryImages } from '../data/images';
import './Gallery.css';

// Configuration: 4 folds, 15-17 images per fold
const FOLDS = 4;
const IMAGES_PER_FOLD = 16;
const MAX_IMAGES = FOLDS * IMAGES_PER_FOLD; // 64 images max

// Generate scattered positions for 4 folds with ~16 images each
const generatePositions = (count) => {
  const positions = [];
  const actualCount = Math.min(count, MAX_IMAGES);
  const widths = ['9%', '10%', '11%', '12%', '13%'];
  const rotations = [-5, -3, -1, 0, 1, 3, 5];
  
  // Seeded random for consistent layout
  const seededRandom = (seed) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < actualCount; i++) {
    // Determine which fold this image belongs to
    const fold = Math.floor(i / IMAGES_PER_FOLD);
    const indexInFold = i % IMAGES_PER_FOLD;
    
    // Each fold is 25% of total height (100% / 4 folds)
    const foldStart = fold * 25;
    const foldHeight = 23; // Leave small gap between folds
    
    // Scatter within the fold - 4 rows of ~4 images
    const row = Math.floor(indexInFold / 4);
    const col = indexInFold % 4;
    
    // Base positions within fold
    const baseTop = foldStart + (row * 5.5) + 2;
    const baseLeft = (col * 22) + 5;
    
    // Add organic randomness
    const topOffset = (seededRandom(i * 7 + 1) - 0.5) * 4;
    const leftOffset = (seededRandom(i * 13 + 2) - 0.5) * 10;
    
    positions.push({
      top: Math.max(foldStart + 1, Math.min(foldStart + foldHeight, baseTop + topOffset)),
      left: Math.max(3, Math.min(85, baseLeft + leftOffset)),
      width: widths[Math.floor(seededRandom(i * 17 + 3) * widths.length)],
      rotate: rotations[Math.floor(seededRandom(i * 23 + 4) * rotations.length)],
      zIndex: Math.floor(seededRandom(i * 31 + 5) * 6) + 1,
    });
  }
  
  return positions;
};

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  
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
  
  // Mouse motion offset for all frames
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  
  const dragRef = useRef({ startX: 0, startY: 0, startLeft: 0, startTop: 0 });
  const containerRef = useRef(null);
  const hasDragged = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Track mouse movement and update offset
  useEffect(() => {
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      
      // Only update if there's actual movement
      if (deltaX !== 0 || deltaY !== 0) {
        setMouseOffset(prev => ({
          // Mouse UP (negative deltaY) → frames DOWN (positive offset)
          // Mouse RIGHT (positive deltaX) → frames LEFT (negative offset)
          x: Math.max(-50, Math.min(50, prev.x - deltaX * 0.3)),
          y: Math.max(-50, Math.min(50, prev.y + deltaY * 0.3))
        }));
      }
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };
    
    // Decay offset back to zero over time
    const decayInterval = setInterval(() => {
      setMouseOffset(prev => ({
        x: Math.abs(prev.x) < 0.5 ? 0 : prev.x * 0.95,
        y: Math.abs(prev.y) < 0.5 ? 0 : prev.y * 0.95
      }));
    }, 16);
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(decayInterval);
    };
  }, []);

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
        ? { ...p, left: newLeft, top: newTop, rotate: 0 }
        : p
    ));
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleImageClick = (image) => {
    if (!hasDragged.current) {
      setSelectedImage(image);
    }
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
        
        // Different depth factor per image for parallax layering
        const depthFactor = 0.5 + (index % 5) * 0.25;
        const offsetX = mouseOffset.x * depthFactor;
        const offsetY = mouseOffset.y * depthFactor;
        
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
                ? 'rotate(0deg) scale(1.05)' 
                : `translate(${offsetX}px, ${offsetY}px) rotate(${position.rotate}deg)`,
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
            <div className="scattered-label">
              <span className="scattered-title">{image.title}</span>
            </div>
          </article>
        );
      })}

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
}

export default Gallery;
