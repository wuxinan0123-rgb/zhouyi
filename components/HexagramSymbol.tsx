import React from 'react';

interface HexagramSymbolProps {
  lines: number[]; // Array of 6 numbers (0 or 1)
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const HexagramSymbol: React.FC<HexagramSymbolProps> = ({ lines, className = '', size = 'md' }) => {
  // Lines are bottom to top in data, but rendered top to bottom visually.
  // So we need to reverse the array for rendering because HTML flows top-down.
  const renderedLines = [...lines].reverse();

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 gap-[2px]';
      case 'md': return 'w-16 gap-1';
      case 'lg': return 'w-32 gap-2';
      case 'xl': return 'w-48 gap-3';
      default: return 'w-16 gap-1';
    }
  };

  const getLineHeight = () => {
    switch (size) {
      case 'sm': return 'h-[2px]';
      case 'md': return 'h-1.5';
      case 'lg': return 'h-3';
      case 'xl': return 'h-4';
      default: return 'h-1.5';
    }
  };

  const lineHeight = getLineHeight();

  return (
    <div className={`flex flex-col ${getSizeClasses()} ${className}`}>
      {renderedLines.map((line, index) => (
        <div key={index} className="w-full flex justify-between">
          {line === 1 ? (
            // Yang Line (Solid)
            <div className={`w-full ${lineHeight} bg-ink-950 rounded-sm`}></div>
          ) : (
            // Yin Line (Broken)
            <>
              <div className={`w-[42%] ${lineHeight} bg-ink-950 rounded-sm`}></div>
              <div className={`w-[42%] ${lineHeight} bg-ink-950 rounded-sm`}></div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default HexagramSymbol;