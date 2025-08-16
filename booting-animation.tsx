import React from 'react';

const BootingAnimation: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="wrap">
        {Array.from({ length: 300 }).map((_, index) => (
          <div key={index} className="c" />
        ))}
      </div>
    </div>
  );
};

export default BootingAnimation;
