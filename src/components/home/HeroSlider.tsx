import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface Slider {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  sortOrder: number;
}

export function HeroSlider() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSliders();
  }, []);

  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders.length]);

  const fetchSliders = async () => {
    try {
      const data = await api.getSliders(true);
      setSliders(data || []);
    } catch (error) {
      console.error('Failed to fetch sliders:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  if (loading) {
    return (
      <div className="h-[60vh] md:h-[80vh] bg-secondary animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (sliders.length === 0) {
    return (
      <div className="h-[60vh] md:h-[80vh] bg-gradient-to-br from-secondary to-background flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-7xl font-display tracking-wider mb-4 text-gradient-neon">
            AMAZINGOUTFITS
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Premium Streetwear Kicks
          </p>
          <Link to="/shop">
            <Button className="btn-neon text-lg px-8 py-6">
              SHOP NOW
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      {sliders.map((slider, index) => (
        <div
          key={slider._id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slider.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
          </div>
          
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-display tracking-wider mb-4 animate-fade-in">
                {slider.title}
              </h2>
              {slider.subtitle && (
                <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  {slider.subtitle}
                </p>
              )}
              {slider.buttonText && slider.buttonLink && (
                <Link to={slider.buttonLink}>
                  <Button className="btn-neon text-lg px-8 py-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {slider.buttonText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/80 h-12 w-12"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/80 h-12 w-12"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots */}
      {sliders.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {sliders.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-primary w-8'
                  : 'bg-foreground/30 hover:bg-foreground/50'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
