import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ImageModal.css';

// Country flag emojis
const countryFlags = {
  'India': '🇮🇳',
  'USA': '🇺🇸',
  'Japan': '🇯🇵',
  'France': '🇫🇷',
  'Singapore': '🇸🇬',
  'Sri Lanka': '🇱🇰',
  'Czech Republic': '🇨🇿',
};

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

const parseAmountValue = (raw) => {
  const cleaned = raw.replace(/,/g, '').trim();
  const value = parseFloat(cleaned);
  return Number.isNaN(value) ? null : value;
};

const formatLocalizedNumber = (value, locale, options = {}) => {
  if (value === null) return null;
  return value.toLocaleString(locale, options);
};

// Format price with proper currency icons and INR conversion
const formatPrice = (price) => {
  if (!price) return null;
  const p = price.trim();
  
  // Already in INR
  if (p.toLowerCase().startsWith('rs')) {
    const cleanedValue = p.replace(/rs\.?\s*/i, '');
    const amount = parseAmountValue(cleanedValue);
    const formatted = amount !== null
      ? `₹${formatLocalizedNumber(amount, 'en-IN', { maximumFractionDigits: 0 })}`
      : `₹${cleanedValue}`;

    return { main: formatted, converted: null };
  }
  
  // USD
  if (p.startsWith('$')) {
    const cleanedValue = p.replace('$', '');
    const amount = parseAmountValue(cleanedValue);
    const formattedMain = amount !== null
      ? `$${formatLocalizedNumber(amount, 'en-US', { maximumFractionDigits: 2 })}`
      : `$${cleanedValue}`;
    const inrAmount = amount !== null ? Math.round(amount * conversionRates.USD) : null;
    return { main: formattedMain, converted: inrAmount !== null ? `₹${formatINR(inrAmount)}` : null };
  }
  
  // EUR symbol
  if (p.startsWith('€')) {
    const cleanedValue = p.replace('€', '');
    const amount = parseAmountValue(cleanedValue);
    const formattedMain = amount !== null
      ? `€${formatLocalizedNumber(amount, 'de-DE', { maximumFractionDigits: 2 })}`
      : `€${cleanedValue}`;
    const inrAmount = amount !== null ? Math.round(amount * conversionRates.EUR) : null;
    return { main: formattedMain, converted: inrAmount !== null ? `₹${formatINR(inrAmount)}` : null };
  }
  
  // "euro" text
  if (p.toLowerCase().startsWith('euro')) {
    const cleanedValue = p.replace(/euro/i, '');
    const amount = parseAmountValue(cleanedValue);
    const formattedMain = amount !== null
      ? `€${formatLocalizedNumber(amount, 'de-DE', { maximumFractionDigits: 2 })}`
      : `€${cleanedValue}`;
    const inrAmount = amount !== null ? Math.round(amount * conversionRates.EUR) : null;
    return { main: formattedMain, converted: inrAmount !== null ? `₹${formatINR(inrAmount)}` : null };
  }

  // GBP
  if (p.startsWith('£')) {
    const cleanedValue = p.replace('£', '');
    const amount = parseAmountValue(cleanedValue);
    const formattedMain = amount !== null
      ? `£${formatLocalizedNumber(amount, 'en-GB', { maximumFractionDigits: 2 })}`
      : `£${cleanedValue}`;
    const inrAmount = amount !== null ? Math.round(amount * conversionRates.GBP) : null;
    return { main: formattedMain, converted: inrAmount !== null ? `₹${formatINR(inrAmount)}` : null };
  }
  
  // JPY
  if (p.toLowerCase().includes('yen')) {
    const cleanedValue = p.replace(/yen/i, '');
    const amount = parseAmountValue(cleanedValue);
    const formattedMain = amount !== null
      ? `¥${formatLocalizedNumber(amount, 'ja-JP', { maximumFractionDigits: 0 })}`
      : `¥${cleanedValue}`;
    const inrAmount = amount !== null ? Math.round(amount * conversionRates.JPY) : null;
    return { main: formattedMain, converted: inrAmount !== null ? `₹${formatINR(inrAmount)}` : null };
  }
  
  // LKR
  if (p.toLowerCase().includes('lkr')) {
    const cleanedValue = p.replace(/lkr/i, '');
    const amount = parseAmountValue(cleanedValue);
    const formattedMain = amount !== null
      ? `LKR ${formatLocalizedNumber(amount, 'en-IN', { maximumFractionDigits: 0 })}`
      : `LKR ${cleanedValue}`;
    const inrAmount = amount !== null ? Math.round(amount * conversionRates.LKR) : null;
    return { main: formattedMain, converted: inrAmount !== null ? `₹${formatINR(inrAmount)}` : null };
  }
  
  return { main: p, converted: null };
};

function ImageModal({ image, onClose, onNavigate }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onNavigate) onNavigate('prev');
      if (e.key === 'ArrowRight' && onNavigate) onNavigate('next');
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNavigate]);

  if (!image) return null;

  const hasDetails = image.name || image.story || image.price;
  const itemCode = `#${image.id.toString().padStart(3, '0')}`;
  const titleMeta = image.brand ? `${itemCode} • ${image.brand}` : itemCode;

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
        <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
          <motion.div 
            className="modal-content"
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
              <span className="modal-title-meta">{titleMeta}</span>

              {/* Title */}
              <h2 className="modal-title">{image.name || `Object #${image.id}`}</h2>

              {/* Pills with emojis */}
              <div className="modal-header">
                {image.howAcquired && (
                  <span className={`modal-badge ${image.howAcquired.toLowerCase()}`}>
                    {image.howAcquired === 'Gifted' ? '🎁' : image.howAcquired === 'Earned' ? '🏆' : '🛒'} {image.howAcquired}
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
                  {image.story
                    .split('\n\n')
                    .map((paragraph, index) => {
                      const words = image.id === 10
                        ? paragraph.split(/(aviavi)/gi)
                        : [paragraph];

                      if (image.id === 20 && index === 0) {
                        return (
                          <p key="nivarah-intro">
                            A friend Kamlesh runs a website with artisnal objects –{' '}
                            <a
                              href="https://nivarah.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="story-link"
                            >
                              Nivarah
                            </a>. I do make matcha frequently at home, he gave me a sweet discount so got this ceramic bowl. Have been making more matcha recipes too since (baked a delicious matcha cake).
                          </p>
                        );
                      }

                      return (
                        <p key={String(index)}>
                          {words.map((segment, segmentIndex) =>
                            image.id === 10 && segment.toLowerCase() === 'aviavi' ? (
                              <a
                                key={`link-${segmentIndex}`}
                                href="https://x.com/aviaviaviii"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="story-link"
                              >Avi</a>
                            ) : (
                              segment
                            )
                          )}
                        </p>
                      );
                    })}
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
                    View product
                    <span className="product-link-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </span>
                  </a>
                  ) : (
                    <div /> 
                  )}
                  
                  {image.price && (() => {
                    const priceData = formatPrice(image.price);
                    return priceData ? (
                      <span className="footer-price">
                        {priceData.main}
                        {priceData.converted && (
                          <span className="price-converted"> ({priceData.converted})</span>
                        )}
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          </motion.div>

          <button
            className="nav-arrow nav-arrow-left"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.('prev');
            }}
            aria-label="Previous item"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          <button
            className="nav-arrow nav-arrow-right"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.('next');
            }}
            aria-label="Next item"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ImageModal;
