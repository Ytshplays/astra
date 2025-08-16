'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ParticleConfig {
  count: number;
  size: { min: number; max: number };
  speed: { min: number; max: number };
  color: string;
  opacity: { min: number; max: number };
  interactive: boolean;
  connectionDistance: number;
  mouseRepulsion: boolean;
  trailLength?: number;
  glow?: boolean;
  pulse?: boolean;
  magnetism?: number;
}

const defaultConfig: ParticleConfig = {
  count: 80,
  size: { min: 0.3, max: 1.2 },
  speed: { min: 0.2, max: 0.8 },
  color: '#00ff41',
  opacity: { min: 0.1, max: 0.6 },
  interactive: true,
  connectionDistance: 120,
  mouseRepulsion: true,
  trailLength: 8,
  glow: true,
  pulse: false,
  magnetism: 0.5
};

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  color: string;
  opacity: number;
  baseOpacity: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number; opacity: number }[];
  pulsePhase: number;

  constructor(width: number, height: number, config: ParticleConfig) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min;
    this.vy = (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min;
    this.size = Math.random() * (config.size.max - config.size.min) + config.size.min;
    this.baseSize = this.size;
    this.color = config.color;
    this.opacity = Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min;
    this.baseOpacity = this.opacity;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
    this.trail = [];
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update(width: number, height: number, mouse: { x: number; y: number }, config: ParticleConfig) {
    // Update trail
    if (config.trailLength && config.trailLength > 0) {
      this.trail.unshift({ x: this.x, y: this.y, opacity: this.opacity });
      if (this.trail.length > config.trailLength) {
        this.trail.pop();
      }
    }

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges with smooth transition
    if (this.x < -10) this.x = width + 10;
    if (this.x > width + 10) this.x = -10;
    if (this.y < -10) this.y = height + 10;
    if (this.y > height + 10) this.y = -10;

    // Mouse interaction with enhanced effects
    if (config.interactive && mouse.x > -1 && mouse.y > -1) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 180;

      if (distance < maxDistance) {
        const force = (1 - distance / maxDistance) * (config.magnetism || 0.5);
        const angle = Math.atan2(dy, dx);
        
        if (config.mouseRepulsion) {
          // Repulsion with turbulence
          this.vx -= Math.cos(angle) * force * 2;
          this.vy -= Math.sin(angle) * force * 2;
          // Add some turbulence
          this.vx += (Math.random() - 0.5) * force * 0.5;
          this.vy += (Math.random() - 0.5) * force * 0.5;
        } else {
          // Attraction with orbital effect
          this.vx += Math.cos(angle) * force;
          this.vy += Math.sin(angle) * force;
          // Add orbital motion
          const perpAngle = angle + Math.PI / 2;
          this.vx += Math.cos(perpAngle) * force * 0.3;
          this.vy += Math.sin(perpAngle) * force * 0.3;
        }
        
        // Dynamic size and opacity based on distance
        this.size = this.baseSize * (1 + force * 0.8);
        this.opacity = this.baseOpacity * (1 + force * 0.6);
      } else {
        // Return to base values
        this.size = this.baseSize;
        this.opacity = this.baseOpacity;
      }
    }

    // Pulse effect
    if (config.pulse) {
      this.pulsePhase += 0.02;
      const pulseFactor = 1 + Math.sin(this.pulsePhase) * 0.3;
      this.size = this.baseSize * pulseFactor;
      this.opacity = this.baseOpacity * pulseFactor;
    }

    // Apply velocity damping
    this.vx *= 0.995;
    this.vy *= 0.995;

    // Keep minimum velocity to prevent particles from stopping
    const minSpeed = config.speed.min * 0.3;
    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (currentSpeed < minSpeed) {
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * minSpeed;
      this.vy = Math.sin(angle) * minSpeed;
    }

    // Update life cycle
    this.life++;
    if (this.life > this.maxLife) {
      this.life = 0;
      // Gentle reset with slight randomization
      this.vx += (Math.random() - 0.5) * 0.1;
      this.vy += (Math.random() - 0.5) * 0.1;
    }
  }

  draw(ctx: CanvasRenderingContext2D, config: ParticleConfig) {
    // Draw trail
    if (config.trailLength && this.trail.length > 1) {
      ctx.save();
      for (let i = 0; i < this.trail.length - 1; i++) {
        const current = this.trail[i];
        const next = this.trail[i + 1];
        const trailOpacity = (this.trail.length - i) / this.trail.length * current.opacity * 0.3;
        
        ctx.strokeStyle = this.color.replace('rgb', 'rgba').replace(')', `, ${trailOpacity})`);
        ctx.lineWidth = this.size * (0.2 + (this.trail.length - i) / this.trail.length * 0.3);
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw main particle with glow
    ctx.save();
    
    if (config.glow) {
      // Outer glow
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 6);
      gradient.addColorStop(0, this.color.replace('rgb', 'rgba').replace(')', `, ${this.opacity * 0.8})`));
      gradient.addColorStop(0.3, this.color.replace('rgb', 'rgba').replace(')', `, ${this.opacity * 0.4})`));
      gradient.addColorStop(1, this.color.replace('rgb', 'rgba').replace(')', `, 0)`));
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Main particle
    ctx.fillStyle = this.color.replace('rgb', 'rgba').replace(')', `, ${this.opacity})`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = this.color.replace('rgb', 'rgba').replace(')', `, ${Math.min(this.opacity * 2, 1)})`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawConnection(ctx: CanvasRenderingContext2D, other: Particle, config: ParticleConfig) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < config.connectionDistance) {
      const opacity = (1 - distance / config.connectionDistance) * 0.3;
      
      // Enhanced connection with glow
      ctx.save();
      ctx.globalAlpha = opacity;
      
      // Main line
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(other.x, other.y);
      ctx.stroke();
      
      // Glow effect
      if (config.glow) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = opacity * 0.3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }
}

export function GrokParticleBackground({ 
  className,
  config = defaultConfig,
  showConnections = true 
}: { 
  className?: string;
  config?: string | Partial<ParticleConfig>;
  showConnections?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1, y: -1 });
  const [isVisible, setIsVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration by ensuring this only runs on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isClient) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Get final config
    let finalConfig: ParticleConfig;
    if (typeof config === 'string') {
      finalConfig = { ...defaultConfig, ...particleConfigs[config as keyof typeof particleConfigs] };
    } else {
      finalConfig = { ...defaultConfig, ...config };
    }

    // Initialize particles
    particlesRef.current = Array.from({ length: finalConfig.count }, () => 
      new Particle(width, height, finalConfig)
    );

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1;
      mouseRef.current.y = -1;
    };

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    const animate = () => {
      if (!isVisible) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(width, height, mouseRef.current, finalConfig);
        particle.draw(ctx, finalConfig);
      });

      // Draw connections
      if (showConnections) {
        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            particlesRef.current[i].drawConnection(ctx, particlesRef.current[j], finalConfig);
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [config, showConnections, isVisible, isClient]);

  // Don't render anything on server to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 -z-10 pointer-events-none', className)}
      style={{ background: 'transparent' }}
    />
  );
}

// Enhanced preset configurations for different pages
export const particleConfigs = {
  login: {
    count: 60,
    size: { min: 0.4, max: 1.5 },
    color: '#00ff41',
    opacity: { min: 0.2, max: 0.8 },
    speed: { min: 0.1, max: 0.5 },
    mouseRepulsion: true,
    trailLength: 6,
    glow: true,
    pulse: false,
    magnetism: 0.8
  },
  dashboard: {
    count: 80,
    size: { min: 0.3, max: 1.2 },
    color: '#0099ff',
    opacity: { min: 0.1, max: 0.5 },
    speed: { min: 0.2, max: 0.6 },
    mouseRepulsion: false,
    trailLength: 8,
    glow: true,
    pulse: true,
    magnetism: 0.6
  },
  store: {
    count: 100,
    size: { min: 0.4, max: 1.8 },
    color: '#ff6b35',
    opacity: { min: 0.15, max: 0.6 },
    speed: { min: 0.3, max: 0.8 },
    mouseRepulsion: true,
    trailLength: 5,
    glow: true,
    pulse: false,
    magnetism: 0.7
  },
  social: {
    count: 90,
    size: { min: 0.3, max: 1.4 },
    color: '#ff1744',
    opacity: { min: 0.1, max: 0.6 },
    speed: { min: 0.2, max: 0.7 },
    mouseRepulsion: false,
    trailLength: 10,
    glow: true,
    pulse: false,
    magnetism: 0.5
  },
  games: {
    count: 110,
    size: { min: 0.4, max: 1.6 },
    color: '#9c27b0',
    opacity: { min: 0.1, max: 0.7 },
    speed: { min: 0.25, max: 0.8 },
    mouseRepulsion: true,
    trailLength: 12,
    glow: true,
    pulse: true,
    magnetism: 0.9
  }
};