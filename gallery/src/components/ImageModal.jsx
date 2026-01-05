import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ImageModal.css';

// Country flag emojis
const countryFlags = {
  'India': '🇮🇳',
  'USA': '🇺🇸',
  'Japan': '🇯🇵',
  'France': '🇫🇷',
};

// Format price with proper currency icons
const formatPrice = (price) => {
  if (!price) return '';
  let p = price.trim();
  if (p.toLowerCase().startsWith('rs')) return p.replace(/rs\.?\s?/i, '₹');
  if (p.toLowerCase().includes('yen')) return '¥' + p.replace(/yen/i, '').trim();
  return p;
};

function ImageModal({ image, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!image) return null;

  const hasDetails = image.name || image.story || image.price;
  const flag = countryFlags[image.from] || '';

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-backdrop" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          
          <div className="modal-image-section">
            <motion.img 
              src={image.src} 
              alt={image.name || `Item ${image.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            />
          </div>
          
          <div className="modal-details">
            {/* Item Code */}
            <span className="item-code">#{image.id.toString().padStart(3, '0')}</span>

            {/* Title */}
            <h2 className="modal-title">{image.name || `Object #${image.id}`}</h2>

            {/* Two pills with emojis */}
            <div className="modal-header">
              {image.howAcquired && (
                <span className={`modal-badge ${image.howAcquired.toLowerCase()}`}>
                  {image.howAcquired === 'Gifted' ? '🎁' : '🛒'} {image.howAcquired}
                </span>
              )}
              {image.from && (
                <span className="modal-badge location">
                  {countryFlags[image.from] || '📍'} {image.from}
                </span>
              )}
            </div>

            {/* Divider */}
            <hr className="modal-divider" />
            
            {/* Memory / Story */}
            {image.story && (
              <div className="modal-story">
                <p>{image.story}</p>
              </div>
            )}

            {!hasDetails && !image.story && (
              <p className="no-details">Details coming soon...</p>
            )}

            {/* Footer with Link (Left) and Price (Right) */}
            <div className="modal-footer">
              <div className="footer-content">
                {image.link ? (
                  <a 
                    href={image.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="product-link"
                  >
                    View Product
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>
                ) : (
                  <div /> 
                )}
                
                {image.price && (
                  <span className="footer-price">{formatPrice(image.price)}</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ImageModal;
