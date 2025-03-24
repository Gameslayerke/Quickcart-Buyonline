import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Carousel.css';

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UseCallback ensures function identity remains the same across renders
  const fetchSlides = useCallback(async () => {
    try {
      const { data } = await axios.get('https://alvins.pythonanywhere.com/carousels');
      const processedSlides = data.data
        .filter(slide => slide.is_active === 1)
        .map(slide => ({
          ...slide,
          url: slide.image_url.startsWith('http') 
            ? slide.image_url 
            : `https://alvins.pythonanywhere.com${slide.image_url}`,
          isBanner: slide.image_url.includes('banner')
        }));

      // Only update state if new slides are different from current slides
      setSlides(prevSlides => {
        if (JSON.stringify(prevSlides) !== JSON.stringify(processedSlides)) {
          return processedSlides.length ? processedSlides : [{
            url: '/default-banner.jpg',
            alt: 'Default banner',
            isBanner: true
          }];
        }
        return prevSlides;
      });

    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load images');
      setSlides([{
        url: '/default-banner.jpg',
        alt: 'Fallback banner',
        isBanner: true
      }]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch images initially
  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]); // ✅ No more ESLint warning

  // Auto-fetch new slides every 10 seconds
  useEffect(() => {
    const interval = setInterval(fetchSlides, 10000);
    return () => clearInterval(interval);
  }, [fetchSlides]); // ✅ No more ESLint warning

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  const goToSlide = (index) => setCurrentIndex(index);
  const goToPrev = () => setCurrentIndex(prev => prev === 0 ? slides.length - 1 : prev - 1);
  const goToNext = () => setCurrentIndex(prev => prev === slides.length - 1 ? 0 : prev + 1);

  if (loading) return <div className="carousel-loading">Loading...</div>;
  if (error) return <div className="carousel-error">{error}</div>;

  return (
    <div className="carousel">
      <button className="carousel-button prev" onClick={goToPrev} aria-label="Previous">
        &#10094;
      </button>

      <div className="carousel-slide-container">
        {slides.map((slide, index) => (
          <div 
            key={slide.url}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            data-is-banner={slide.isBanner}
          >
            <img
              src={slide.url}
              alt={slide.alt || `Slide ${index + 1}`}
              onError={(e) => {
                e.target.src = '/fallback-image.jpg';
                e.target.alt = 'Failed to load image';
              }}
            />
          </div>
        ))}
      </div>

      <button className="carousel-button next" onClick={goToNext} aria-label="Next">
        &#10095;
      </button>

      {slides.length > 1 && (
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
