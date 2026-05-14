import { useEffect, useRef } from 'react';

export function Marquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const text = marquee.querySelector('.marquee-text') as HTMLElement;
    if (!text) return;

    // Duplicate the text for seamless scrolling
    const clone = text.cloneNode(true) as HTMLElement;
    marquee.appendChild(clone);

    // Calculate animation duration based on text width
    const textWidth = text.offsetWidth;
    const duration = textWidth / 50; // pixels per second
    marquee.style.setProperty('--duration', `${duration}s`);
  }, []);

  return (
    <div className="bg-black text-primary font-display text-lg py-2 overflow-hidden relative">
      <div
        ref={marqueeRef}
        className="flex whitespace-nowrap animate-marquee"
        style={{
          animation: 'marquee var(--duration, 20s) linear infinite',
        }}
      >
        <div className="marquee-text flex items-center gap-8 px-4">
          <span>FREE DELIVERY NAIROBI</span>
          <span>•</span>
          <span>NEW ARRIVALS</span>
          <span>•</span>
          <span>PAY WITH MPESA</span>
          <span>•</span>
          <span>AUTHENTIC KICKS</span>
          <span>•</span>
        </div>
      </div>
    </div>
  );
}