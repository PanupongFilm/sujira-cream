'use client';

import { useEffect, useRef } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: false,
      desynchronized: true 
    });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Heart shape calculation
    const getHeartPoint = (t: number, size: number) => {
      const x = size * 16 * Math.pow(Math.sin(t), 3);
      const y = -size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return { x, y };
    };

    // Text particles
    interface Particle {
      offset: number;
      text: string;
    }

    const particles: Particle[] = [];
    const texts = ['I love u', 'cream', 'sujira'];
    const numParticles = 40;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        offset: (i / numParticles) * Math.PI * 2,
        text: texts[i % texts.length]
      });
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const heartSize = Math.min(canvas.width, canvas.height) / 35;
    let time = 0;

    // Animation loop
    const animate = () => {
      // Clear screen
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.003;

      // Set text style once
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      particles.forEach((particle) => {
        const t = particle.offset + time;
        const point = getHeartPoint(t, heartSize);
        
        const x = centerX + point.x;
        const y = centerY + point.y;

        // Draw text without shadow for better performance
        ctx.fillStyle = '#FFB6C1';
        ctx.fillText(particle.text, x, y);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
