'use client'

import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';

export default function LottiePlayer() {
  const animationContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      const animation = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/Lottie_AI_orb.json',
      });

      // Set the speed of the animation
      animation.setSpeed(1); // Slow speed for testing

      // Cleanup function to destroy the animation instance
      return () => {
        animation.destroy();
      };
    }
  }, []);

  return <div ref={animationContainer}></div>;
}
