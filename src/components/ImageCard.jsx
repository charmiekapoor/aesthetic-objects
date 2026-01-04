import { useState } from 'react';
import './ImageCard.css';

function ImageCard({ image, onClick, index }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <article 
      className={`image-card ${isLoaded ? 'loaded' : ''}`}
      onClick={() => onClick(image)}
    >
      <div className="image-wrapper">
        <img
          src={image.src}
          alt={image.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
        <div className="image-overlay">
          <span className="view-text">View Details</span>
        </div>
      </div>
      <div className="card-content">
        <span className="category-tag">{image.category}</span>
        <h3>{image.title}</h3>
        <p>{image.description}</p>
      </div>
    </article>
  );
}

export default ImageCard;

