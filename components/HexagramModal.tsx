import React, { useEffect, useState, useRef } from 'react';
import { HexagramData } from '../types';
import HexagramSymbol from './HexagramSymbol';
import { X, Sparkles, BookOpen, Loader2, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';
import { streamHexagramInterpretation } from '../services/geminiService';
import { TRIGRAMS } from '../constants';

interface HexagramModalProps {
  hexagram: HexagramData | null;
  isOpen: boolean;
  onClose: () => void;
}

const HexagramModal: React.FC<HexagramModalProps> = ({ hexagram, isOpen, onClose }) => {
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const contentEndRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef<number | null>(null);

  // Derived Trigrams
  const lowerLines = hexagram ? hexagram.symbol.slice(0, 3) : [];
  const upperLines = hexagram ? hexagram.symbol.slice(3, 6) : [];
  const lowerTrigram = hexagram ? TRIGRAMS[lowerLines.join(',')] : null;
  const upperTrigram = hexagram ? TRIGRAMS[upperLines.join(',')] : null;

  useEffect(() => {
    if (isOpen && hexagram && hasFetchedRef.current !== hexagram.id) {
      setInterpretation('');
      fetchInterpretation(hexagram);
      hasFetchedRef.current = hexagram.id;
    } else if (!isOpen) {
      // Reset when closed
    }
  }, [isOpen, hexagram]);

  const fetchInterpretation = async (data: HexagramData) => {
    setIsLoading(true);
    setIsStreaming(true);
    try {
      await streamHexagramInterpretation(data, (text) => {
        setIsLoading(false);
        setInterpretation((prev) => prev + text);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (isStreaming) {
        // Auto scroll can be enabled here
    }
  }, [interpretation, isStreaming]);

  const handleRegenerate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hexagram) {
        setInterpretation('');
        hasFetchedRef.current = null; 
        fetchInterpretation(hexagram);
    }
  };

  if (!isOpen || !hexagram) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-paper-50 rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden ring-1 ring-ink-200">
        
        {/* Left Sidebar (Symbol & Structure) */}
        <div className="w-full md:w-1/3 bg-paper-200/50 p-6 lg:p-8 flex flex-col border-b md:border-b-0 md:border-r border-ink-100 relative overflow-y-auto">
           {/* Background decorative character */}
           <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none overflow-hidden">
             <span className="text-[20rem] font-serif font-bold text-ink-900">{hexagram.name}</span>
           </div>

          <div className="z-10 flex flex-col items-center text-center">
            <div className="mb-6 p-6 bg-white shadow-inner rounded-lg ring-1 ring-ink-100/50">
                <HexagramSymbol lines={hexagram.symbol} size="xl" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-serif text-ink-900 mb-2">{hexagram.name}</h2>
            <p className="text-xl text-ink-600 font-display italic mb-1">{hexagram.pinyin}</p>
            <p className="text-lg text-ink-500 uppercase tracking-widest mb-6">{hexagram.english}</p>
            
            {/* Trigram Composition */}
            <div className="w-full mt-4 pt-6 border-t border-ink-200/60">
                <p className="text-xs font-sans uppercase tracking-widest text-ink-400 mb-4">Composition 卦象结构</p>
                
                <div className="flex flex-col gap-4 w-full px-2">
                    {/* Upper Trigram */}
                    {upperTrigram && (
                        <div className="flex items-center justify-between group p-2 rounded hover:bg-white/50 transition-colors">
                             <div className="flex items-center gap-3">
                                <div className="bg-ink-900/5 p-1 rounded">
                                    <HexagramSymbol lines={upperLines} size="sm" className="scale-75 origin-left" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-ink-800">{upperTrigram.name} ({upperTrigram.nature})</div>
                                    <div className="text-xs text-ink-500 uppercase">{upperTrigram.english}</div>
                                </div>
                             </div>
                             <span className="text-xs font-mono text-ink-400 flex items-center gap-1">
                                上 <ArrowUp size={10} />
                             </span>
                        </div>
                    )}

                    {/* Separator */}
                    <div className="relative py-1">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-ink-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-paper-200 px-2 text-xs text-ink-400 italic font-serif">
                                {upperTrigram?.nature} over {lowerTrigram?.nature}
                            </span>
                        </div>
                    </div>

                    {/* Lower Trigram */}
                    {lowerTrigram && (
                        <div className="flex items-center justify-between group p-2 rounded hover:bg-white/50 transition-colors">
                             <div className="flex items-center gap-3">
                                <div className="bg-ink-900/5 p-1 rounded">
                                    <HexagramSymbol lines={lowerLines} size="sm" className="scale-75 origin-left" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-ink-800">{lowerTrigram.name} ({lowerTrigram.nature})</div>
                                    <div className="text-xs text-ink-500 uppercase">{lowerTrigram.english}</div>
                                </div>
                             </div>
                             <span className="text-xs font-mono text-ink-400 flex items-center gap-1">
                                下 <ArrowDown size={10} />
                             </span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-auto pt-8 text-ink-400 text-xs">
              <span className="uppercase tracking-wider">Hexagram #{hexagram.id}</span>
            </div>
          </div>
        </div>

        {/* Right Content (Interpretation) */}
        <div className="w-full md:w-2/3 bg-paper-50 flex flex-col relative h-[60vh] md:h-auto">
            {/* Header Actions */}
            <div className="absolute top-4 right-4 flex gap-2 z-20">
                <button 
                    onClick={handleRegenerate}
                    className="p-2 text-ink-500 hover:text-ink-900 hover:bg-paper-200 rounded-full transition-colors"
                    title="Regenerate Interpretation"
                >
                    <RefreshCw size={20} className={isStreaming ? "animate-spin" : ""} />
                </button>
                <button 
                    onClick={onClose}
                    className="p-2 text-ink-500 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">
                {isLoading && !interpretation && (
                    <div className="flex flex-col items-center justify-center h-full text-ink-400 gap-4">
                        <Loader2 className="animate-spin w-10 h-10" />
                        <p className="font-serif italic animate-pulse">Consulting the Oracle...</p>
                    </div>
                )}

                {(interpretation || (!isLoading && !interpretation)) && (
                     <div className="prose prose-stone prose-lg max-w-none font-serif text-ink-800 leading-relaxed pb-10">
                        <div className="flex items-center gap-3 text-ink-600 mb-6 pb-4 border-b border-ink-100">
                            <Sparkles className="w-5 h-5 text-amber-600" />
                            <h3 className="text-lg font-display uppercase tracking-widest m-0">Interpretation / 解卦</h3>
                        </div>
                        
                        {interpretation ? (
                             <div className="whitespace-pre-wrap animate-in fade-in duration-1000">
                                {interpretation.split('**').map((part, i) => 
                                    i % 2 === 1 ? <strong key={i} className="text-ink-950 font-bold">{part}</strong> : part
                                )}
                             </div>
                        ) : (
                            <div className="text-center text-ink-400 italic mt-20">
                                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                No interpretation available yet.
                            </div>
                        )}
                        <div ref={contentEndRef} />
                     </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default HexagramModal;