'use client';

import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

export default function TestPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: AnimationItem | undefined;

    if (containerRef.current) {
      console.log("Loading animation...");
      animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/Wave_Right.json', // Update this path
      });

      animation.addEventListener('DOMLoaded', () => {
        console.log("Animation DOM loaded");
        animation?.play(); // Force play the animation
      });

      animation.addEventListener('data_ready', () => {
        console.log("Animation data ready");
        console.log("Animation object:", animation);
      });

      animation.addEventListener('complete', () => {
        console.log("Animation cycle completed");
      });

      animation.addEventListener('loopComplete', () => {
        console.log("Animation loop completed");
      });
    }

    return () => {
      if (animation) {
        console.log("Destroying animation");
        animation.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '500px', border: '1px solid red' }}
    ></div>
  );
}
