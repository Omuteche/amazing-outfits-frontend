import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthSlider } from '@/hooks/useAuthSlider';
import './AuthSlider.css';

interface SliderItem {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export default function AuthSlider() {
  const { slides, loading, error } = useAuthSlider();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  // Reset to first slide when slides change
  useEffect(() => {
    setCurrentSlide(0);
  }, [slides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-muted/20 rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground">Loading slider...</div>
      </div>
    );
  }

  if (error || slides.length === 0) {
    return (
      <div className="w-full h-96 bg-muted/20 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Welcome to AmazingOutfits</h3>
          <p className="text-muted-foreground">Discover the latest streetwear trends</p>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main Slider Container */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl slider-glass">
        {/* Slide Content */}
        <div className="relative h-96 md:h-[28rem] flex items-center justify-center p-8">
          <div className="text-center space-y-6 animate-fade-in">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${currentSlideData.imageUrl})` }}
            />

            {/* Content Overlay */}
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white slider-title animate-fade-in">
                {currentSlideData.title}
              </h2>

              {currentSlideData.subtitle && (
                <p className="text-lg md:text-xl text-white/90 max-w-md mx-auto slider-subtitle animate-fade-in animation-delay-200">
                  {currentSlideData.subtitle}
                </p>
              )}

              {currentSlideData.buttonText && currentSlideData.buttonLink && (
                <div className="animate-fade-in animation-delay-400">
                  <Button
                    asChild
                    className="btn-neon text-lg px-8 py-3 hover:scale-105 transition-transform"
                  >
                    <a href={currentSlideData.buttonLink} target="_blank" rel="noopener noreferrer">
                      {currentSlideData.buttonText}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white slider-nav-btn"
              onClick={goToPrevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white slider-nav-btn"
              onClick={goToNextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Dot Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all slider-dot ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Admin Notes (visible only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground">
          <strong>Admin Notes:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Slider content is fetched from <code>/api/sliders</code> endpoint</li>
            <li>• Edit slides in Admin Panel → Sliders section</li>
            <li>• Add <code>page: 'auth'</code> field to Slider model for auth-specific filtering</li>
            <li>• Images should be optimized for web (800x400px recommended)</li>
            <li>• Button links support internal routes or external URLs</li>
          </ul>
        </div>
      )}
    </div>
  );
}
