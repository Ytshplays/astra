'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import BootingAnimation from './booting-animation';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showBooting, setShowBooting] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show booting animation on login page
    if (pathname === '/login') {
      setShowBooting(false);
      setIsLoading(false);
      return;
    }

    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem('astra-visited');
    
    if (!hasVisited) {
      // First visit - show booting animation
      sessionStorage.setItem('astra-visited', 'true');
      setShowBooting(true);
    } else {
      // Not first visit - skip booting animation
      setShowBooting(false);
      setIsLoading(false);
    }
  }, [pathname]);

  const handleBootingComplete = () => {
    setIsLoading(false);
  };

  if (showBooting && isLoading) {
    return (
      <BootingAnimation 
        onComplete={handleBootingComplete}
        duration={3500}
      />
    );
  }

  return <>{children}</>;
}
