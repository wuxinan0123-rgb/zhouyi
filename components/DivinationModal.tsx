import React, { useState, useEffect } from 'react';
import { HexagramData } from '../types';
import { HEXAGRAMS } from '../constants';
// Fix: Import RefreshCw from lucide-react
import { X, ArrowRight, Disc, Sparkles, RefreshCw } from 'lucide-react';

interface DivinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (hexagram: HexagramData) => void;
}

type CoinValue = 2 | 3; // 2 = Yin side, 3 = Yang side

const DivinationModal: React.FC<DivinationModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [lines, setLines] = useState<number[]>([]); // 0 or 1, bottom to top
  const [currentCoins, setCurrentCoins] = useState<CoinValue[]>([3, 3, 3]);
  const [isTossing, setIsTossing] = useState(false);
  const [step, setStep] = useState(0); // 0 to 6

  useEffect(() => {
    if (isOpen) {
      setLines([]);
      setStep(0);
      setCurrentCoins([3, 3, 3]);
    }
  }, [isOpen]);

  const tossCoins = () => {
    if (step >= 6 || isTossing) return;

    setIsTossing(true);
    
    // Animate coins for a short duration
    const interval = setInterval(() => {
      setCurrentCoins([
        Math.random() > 0.5 ? 3 : 2,
        Math.random() > 0.5 ? 3 : 2,
        Math.random() > 0.5 ? 3 : 2,
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      
      // Final values
      const finalCoins: CoinValue[] = [
        Math.random() > 0.5 ? 3 : 2,
        Math.random() > 0.5 ? 3 : 2,
        Math.random() > 0.5 ? 3 : 2,
      ];
      setCurrentCoins(finalCoins);
      
      // Calculate sum:
      // 6 (2+2+2) = Old Yin -> 0 (Yin)
      // 7 (2+2+3) = Young Yang -> 1 (Yang)
      // 8 (2+3+3) = Young Yin -> 0 (Yin)
      // 9 (3+3+3) = Old Yang -> 1 (Yang)
      const sum = finalCoins.reduce((a, b) => a + b, 0);
      const newLine = (sum === 7 || sum === 9) ? 1 : 0;

      setLines(prev => [...prev, newLine]);
      setStep(prev => prev + 1);
      setIsTossing(false);
    }, 800);
  };

  const finishDivination = () => {
    // Find hexagram matching the lines
    const matched = HEXAGRAMS.find(h => 
      h.symbol.length === lines.length && 
      h.symbol.every((val, index) => val === lines[index])
    );

    if (matched) {
      onComplete(matched);
    } else {
        console.error("No matching hexagram found for lines:", lines);
        onClose();
    }
  };

  if (!isOpen) return null;

  // Render helper for lines (Building from bottom to top)
  // We want visual stack: Top (Line 6) -> Bottom (Line 1)
  // lines array is [Line 1, Line 2...]
  const renderLineStack = () => {
    const stack = [];
    for (let i = 5; i >= 0; i--) {
      const isCast = i < lines.length;
      const lineValue = lines[i]; // This works because lines is 0-indexed matching 1-indexed height
      
      stack.push(
        <div key={i} className={`w-48 h-6 flex justify-between items-center transition-all duration-500 ${isCast ? 'opacity-100 scale-100' : 'opacity-10 scale-95'}`}>
          {isCast ? (
             lineValue === 1 ? (
               // Solid Yang
               <div className="w-full h-4 bg-ink-900 rounded-sm shadow-sm"></div>
             ) : (
               // Broken Yin
               <>
                 <div className="w-[45%] h-4 bg-ink-900 rounded-sm shadow-sm"></div>
                 <div className="w-[45%] h-4 bg-ink-900 rounded-sm shadow-sm"></div>
               </>
             )
          ) : (
            // Placeholder
            <div className="w-full h-4 border-2 border-dashed border-ink-300 rounded-sm"></div>
          )}
          
          {/* Line Number Label */}
           <div className="absolute -right-8 text-xs text-ink-400 font-mono">
             {i + 1}
           </div>
        </div>
      );
    }
    return stack;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-paper-50 rounded-2xl shadow-2xl overflow-hidden border border-paper-200 flex flex-col relative">
        
        {/* Header */}
        <div className="p-6 border-b border-ink-100 flex justify-between items-center bg-white/50">
            <div>
                <h2 className="text-2xl font-display font-bold text-ink-900">Consult the Oracle</h2>
                <p className="text-sm text-ink-500 font-sans">Focus on your question and cast the lines.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-ink-100 rounded-full transition-colors">
                <X size={24} className="text-ink-400" />
            </button>
        </div>

        {/* Main Stage */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-paper-100/50 min-h-[400px]">
            
            {/* Hexagram Building Area */}
            <div className="relative flex flex-col gap-3 mb-10 p-6 bg-white shadow-inner rounded-lg ring-1 ring-ink-100/50">
                {renderLineStack()}
            </div>

            {/* Controls */}
            <div className="w-full max-w-xs flex flex-col items-center gap-6">
                {step < 6 ? (
                    <>
                        {/* Coins Visual */}
                        <div className="flex gap-4 justify-center perspective-1000">
                            {currentCoins.map((val, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-bold shadow-lg transition-all duration-300 transform
                                        ${isTossing ? 'rotate-y-180 scale-110' : 'rotate-y-0 scale-100'}
                                        ${val === 3 ? 'bg-amber-500 border-amber-600 text-white' : 'bg-ink-700 border-ink-800 text-white'}
                                    `}
                                >
                                    {val === 3 ? '阳' : '阴'}
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            onClick={tossCoins}
                            disabled={isTossing}
                            className="w-full py-4 px-6 bg-ink-900 text-white font-display text-lg rounded-xl shadow-lg hover:bg-ink-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                        >
                            {isTossing ? (
                                <RefreshCw className="animate-spin" /> 
                            ) : (
                                <Disc className="animate-pulse" />
                            )}
                            <span>
                                {isTossing ? 'Tossing...' : `Cast Line ${step + 1}`}
                            </span>
                        </button>
                    </>
                ) : (
                    <div className="animate-in zoom-in duration-500 flex flex-col items-center gap-4 w-full">
                        <div className="text-center mb-2">
                            <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                            <p className="text-ink-600 font-serif italic">The hexagram is formed.</p>
                        </div>
                        <button 
                            onClick={finishDivination}
                            className="w-full py-4 px-6 bg-amber-600 text-white font-display text-lg rounded-xl shadow-lg hover:bg-amber-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Reveal Interpretation</span>
                            <ArrowRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DivinationModal;