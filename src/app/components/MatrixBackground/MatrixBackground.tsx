'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './MatrixBackground.module.css';

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMatrixTheme, setIsMatrixTheme] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const isMatrix = currentTheme === 'matrix';
      console.log('Current theme:', currentTheme, 'Is Matrix:', isMatrix);
      setIsMatrixTheme(isMatrix);
    };

    // Initial check
    checkTheme();

    // Create observer to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMatrixTheme) {
      console.log('Matrix theme not active, skipping animation');
      return;
    }

    console.log('Starting matrix animation');
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('No canvas element found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('Could not get canvas context');
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log('Canvas resized:', canvas.width, 'x', canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = '01';
    const fontSize = 16; // Increased font size
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Increased opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      ctx.fillStyle = '#00FF00'; // Brighter green
      ctx.font = `bold ${fontSize}px monospace`; // Made text bold

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop when it reaches bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33); // ~30fps

    return () => {
      console.log('Cleaning up matrix animation');
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isMatrixTheme]);

  if (!isMatrixTheme) {
    console.log('Not rendering matrix background - theme not active');
    return null;
  }

  console.log('Rendering matrix background');
  return <canvas ref={canvasRef} className={styles.matrixBackground} />;
};

export default MatrixBackground; 