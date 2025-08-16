
'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles: Particle[] = [];
    const particleCount = 150; // Reduced particle count slightly
    const mouse = { x: -9999, y: -9999 };

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 0.5 + 0.1; // Further reduced particle size for a 'dusty' effect
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
        // Changed color to solid white for visibility
        this.color = '#ffffff'; 
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);        
        const maxDistance = 150; // Increased interaction distance
        let forceDirectionX = dx / distance; // Removed redundant division by distance later
        let forceDirectionY = dy / distance; // Removed redundant division by distance later
        let force = (maxDistance - distance) / maxDistance; // Calculate force based on distance        
        let directionX = forceDirectionX * force * this.density * 0.5; // Reduced the overall force slightly
        let directionY = forceDirectionY * force * this.density * 0.5; // Reduced the overall force slightly
    
        if (distance < maxDistance) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;            
            this.x -= dx * 0.05; // Smoother and more gradual return to base
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
      }
    }

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = event.x;
        mouse.y = event.y;
    }

    const handleMouseLeave = () => {
        mouse.x = -9999;
        mouse.y = -9999;
    }

    const handleClick = () => {
      // Disperse particles on click
      particles.forEach(particle => {
        particle.x += (Math.random() - 0.5) * 200; // Increased dispersion on click
        particle.y += (Math.random() - 0.5) * 200; // Increased dispersion on click
      });
    };

    init();
    animate();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // Removed opacity-60 for better visibility
      className={cn('fixed inset-0 -z-10 h-full w-full')}
    />
  );
}
