'use client';

import React, { useEffect, useState } from 'react';
import { NexusLogo } from './nexus-logo';
import { cn } from '@/lib/utils';

interface BootingAnimationProps {
  onComplete?: () => void;
  duration?: number;
  showLogo?: boolean;
}

const BootingAnimation: React.FC<BootingAnimationProps> = ({ 
  onComplete, 
  duration = 4000,
  showLogo = true 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('INITIALIZING...');
  const [isComplete, setIsComplete] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [particleData, setParticleData] = useState<Array<{z: number, y: number, delay: number}>>([]);

  // Generate particles only on client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    const generatedParticles = Array.from({ length: 150 }, () => ({
      z: Math.random() * 360,
      y: Math.random() * 360,
      delay: Math.random() * 2
    }));
    setParticleData(generatedParticles);
  }, []);

  const bootSequence = [
    { text: 'INITIALIZING ASTRA...', progress: 0 },
    { text: 'LOADING CORE SYSTEMS...', progress: 20 },
    { text: 'ESTABLISHING CONNECTIONS...', progress: 40 },
    { text: 'SYNCHRONIZING DATA...', progress: 60 },
    { text: 'OPTIMIZING PERFORMANCE...', progress: 80 },
    { text: 'ASTRA READY', progress: 100 }
  ];

  useEffect(() => {
    let currentIndex = 0;
    let progressInterval: NodeJS.Timeout;

    const startBootSequence = () => {
      progressInterval = setInterval(() => {
        if (currentIndex < bootSequence.length) {
          const current = bootSequence[currentIndex];
          setCurrentText(current.text);
          setProgress(current.progress);
          
          if (current.progress === 100) {
            setTimeout(() => {
              setIsComplete(true);
              setTimeout(() => {
                onComplete?.();
              }, 500);
            }, 800);
          }
          
          currentIndex++;
        } else {
          clearInterval(progressInterval);
        }
      }, duration / bootSequence.length);
    };

    // Small delay before starting
    setTimeout(startBootSequence, 300);

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [duration, onComplete]);

  // Generate particles for the 3D orb effect (client-side only)
  const renderParticles = () => {
    if (!isClient) return null;
    
    return particleData.map((particle, i) => (
      <div
        key={i}
        className="particle"
        style={{
          '--random-z': `${particle.z}deg`,
          '--random-y': `${particle.y}deg`,
          '--delay': `${particle.delay}s`,
          animationDelay: `${particle.delay}s`
        } as React.CSSProperties}
      />
    ));
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-black transition-opacity duration-1000",
      isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
    )}>
      {/* Particle Orb Animation */}
      <div className="orb-container">
        <div className="orb-wrap">
          {renderParticles()}
        </div>
      </div>

      {/* Boot Interface */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showLogo && (
          <div className="mb-8 scale-150 opacity-80">
            <NexusLogo />
          </div>
        )}
        
        {/* Console-style Boot Text */}
        <div className="font-mono text-center space-y-4 max-w-md">
          <div className="text-green-400 text-lg mb-6 typing-animation">
            {currentText}
          </div>
          
          {/* Progress Bar */}
          <div className="w-80 h-2 bg-gray-800 border border-green-400/30 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-300 transition-all duration-500 progress-glow"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress Percentage */}
          <div className="text-green-300 text-sm font-mono">
            {progress}% COMPLETE
          </div>
          
          {/* System Info */}
          <div className="text-xs text-green-500/60 mt-8 space-y-1">
            <div>ASTRA v2.0</div>
            <div>POWERED BY NEXT.JS</div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        .orb-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
        }

        .orb-wrap {
          position: relative;
          width: 0;
          height: 0;
          transform-style: preserve-3d;
          perspective: 1000px;
          animation: rotate 14s infinite linear;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          opacity: 0;
          background: linear-gradient(45deg, #00ff41, #00cc33);
          box-shadow: 0 0 6px #00ff41;
          animation: orbit 14s infinite;
          animation-delay: var(--delay);
        }

        @keyframes rotate {
          100% {
            transform: rotateY(360deg) rotateX(360deg);
          }
        }

        @keyframes orbit {
          0% {
            opacity: 0;
            transform: rotateZ(var(--random-z)) rotateY(var(--random-y)) translateX(0);
          }
          20% {
            opacity: 1;
          }
          30% {
            transform: rotateZ(var(--random-z)) rotateY(var(--random-y)) translateX(100px);
          }
          100% {
            opacity: 0.8;
            transform: rotateZ(var(--random-z)) rotateY(var(--random-y)) translateX(300px);
          }
        }

        .typing-animation {
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid #00ff41;
          animation: typing 1s steps(40, end), blink-cursor 1s infinite;
        }

        @keyframes typing {
          from { 
            width: 0; 
          }
          to { 
            width: 100%; 
          }
        }

        @keyframes blink-cursor {
          from, to { 
            border-color: transparent; 
          }
          50% { 
            border-color: #00ff41; 
          }
        }

        .progress-glow {
          box-shadow: 0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41;
          animation: pulse-glow 2s ease-in-out infinite alternate;
        }

        @keyframes pulse-glow {
          from {
            box-shadow: 0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41;
          }
          to {
            box-shadow: 0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41;
          }
        }
      `}</style>
    </div>
  );
};

export default BootingAnimation;
