import { useEffect } from 'react';
import './ImageModal.css';

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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        
        <div className="modal-image-section">
          <img src={image.src} alt={image.title} />
        </div>
        
        <div className="modal-details">
          <span className="modal-category">{image.category}</span>
          <h2>{image.title}</h2>
          <p className="modal-description">{image.description}</p>
          
          <div className="modal-tags">
            {image.tags.map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
          
          <div className="modal-meta">
            <div className="meta-item">
              <span className="meta-label">ID</span>
              <span className="meta-value">#{String(image.id).padStart(3, '0')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageModal;

