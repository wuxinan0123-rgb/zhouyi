import React, { useState, useMemo } from 'react';
import { HEXAGRAMS, TRIGRAMS } from './constants';
import { HexagramData } from './types';
import HexagramSymbol from './components/HexagramSymbol';
import HexagramModal from './components/HexagramModal';
import DivinationModal from './components/DivinationModal';
import { Search, Info, Command } from 'lucide-react';

const App: React.FC = () => {
  const [selectedHexagram, setSelectedHexagram] = useState<HexagramData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDivinationOpen, setIsDivinationOpen] = useState(false);

  const filteredHexagrams = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const results = HEXAGRAMS.filter(
      (h) =>
        h.name.includes(q) ||
        h.pinyin.toLowerCase().includes(q) ||
        h.english.toLowerCase().includes(q) ||
        h.id.toString() === q
    );
    // Explicitly sort by ID to ensure 1-64 order
    return results.sort((a, b) => a.id - b.id);
  }, [searchQuery]);

  const handleDivinationComplete = (hexagram: HexagramData) => {
    setIsDivinationOpen(false);
    setSelectedHexagram(hexagram);
  };

  const getTrigramInfo = (symbol: number[]) => {
    const lowerKey = symbol.slice(0, 3).join(',');
    const upperKey = symbol.slice(3, 6).join(',');
    return {
      lower: TRIGRAMS[lowerKey],
      upper: TRIGRAMS[upperKey]
    };
  };

  const getLuckStyles = (luck: string) => {
    switch (luck) {
      case '上上':
        return {
          border: 'border-red-300',
          badge: 'bg-red-500 text-white border-red-600',
          bg: 'bg-red-100 hover:bg-red-200',
          text: 'text-red-900'
        };
      case '中上':
        return {
          border: 'border-amber-300',
          badge: 'bg-amber-500 text-white border-amber-600',
          bg: 'bg-amber-100 hover:bg-amber-200',
          text: 'text-amber-900'
        };
      case '中平':
      case '中中':
        return {
          border: 'border-blue-300',
          badge: 'bg-blue-500 text-white border-blue-600',
          bg: 'bg-blue-100 hover:bg-blue-200',
          text: 'text-blue-900'
        };
      case '中下':
        return {
          border: 'border-slate-400',
          badge: 'bg-slate-600 text-white border-slate-700',
          bg: 'bg-slate-200 hover:bg-slate-300',
          text: 'text-slate-800'
        };
      case '下下':
        return {
          border: 'border-stone-500',
          badge: 'bg-stone-700 text-white border-stone-800',
          bg: 'bg-stone-300 hover:bg-stone-400',
          text: 'text-stone-900'
        };
      default:
        return {
          border: 'border-ink-200',
          badge: 'bg-ink-600 text-white',
          bg: 'bg-white hover:bg-paper-50',
          text: 'text-ink-900'
        };
    }
  };

  return (
    <div className="min-h-screen bg-paper-50 text-ink-900 font-serif selection:bg-amber-200 selection:text-ink-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-paper-50/80 backdrop-blur-md border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ink-900 text-paper-50 rounded-full flex items-center justify-center font-bold font-display text-xl shadow-lg">
              易
            </div>
            <div>
                <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-ink-900 leading-none">
                    Zhouyi
                </h1>
                <p className="text-xs text-ink-500 font-sans tracking-widest uppercase">The Book of Changes</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
             {/* Search Bar - Desktop/Tablet */}
            <div className="relative hidden sm:block group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-ink-400 group-focus-within:text-amber-600 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search / 搜索卦名..."
                    className="block w-64 pl-10 pr-3 py-1.5 border border-ink-200 rounded-full leading-5 bg-white/50 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all sm:text-sm font-sans"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <button 
                onClick={() => setIsDivinationOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-ink-900 text-paper-50 rounded-full text-sm font-sans font-medium hover:bg-ink-800 transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
                <Command size={16} />
                <span>Divinate</span>
            </button>
            
            <button 
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className="p-2 text-ink-500 hover:text-ink-900 hover:bg-ink-100 rounded-full transition-colors"
                aria-label="About"
            >
                <Info size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="sm:hidden px-4 pb-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-ink-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search / 搜索卦名..."
                    className="block w-full pl-10 pr-3 py-2 border border-ink-200 rounded-lg leading-5 bg-white/50 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 sm:text-sm font-sans"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
             <button 
                onClick={() => setIsDivinationOpen(true)}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-ink-900 text-paper-50 rounded-lg text-sm font-sans font-medium active:scale-95 shadow-md"
            >
                <Command size={16} />
                <span>Ask the Oracle</span>
            </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* About Section (Toggleable) */}
        {isAboutOpen && (
            <div className="mb-10 p-6 sm:p-8 bg-paper-100 rounded-2xl border border-paper-300 animate-in fade-in slide-in-from-top-4 shadow-inner">
                <h2 className="text-2xl font-display font-bold mb-4 text-ink-800">About the I Ching</h2>
                <p className="text-ink-600 leading-relaxed mb-4 max-w-3xl">
                    The I Ching (Book of Changes) is one of the oldest of the Chinese classic texts. 
                    At its core are 64 hexagrams, each representing a state or process of change. 
                    Use this tool to explore the wisdom of the ancients, interpreted by modern AI.
                </p>
                <p className="text-sm text-ink-500 italic">
                    Click on any hexagram to reveal its detailed meaning.
                </p>
            </div>
        )}

        {filteredHexagrams.length === 0 ? (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">🍃</div>
                <h3 className="text-xl font-display text-ink-500">No hexagrams found</h3>
                <p className="text-ink-400">Try searching for a name or number.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {filteredHexagrams.map((hex) => {
                const { lower, upper } = getTrigramInfo(hex.symbol);
                const style = getLuckStyles(hex.luck);
                
                return (
                    <div
                    key={hex.id}
                    onClick={() => setSelectedHexagram(hex)}
                    className={`group relative rounded-xl p-4 pt-8 shadow-sm border-2 ${style.border} hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center hover:-translate-y-1 ${style.bg}`}
                    >
                    
                    {/* Hexagram ID - Permanently Visible */}
                    <div className="absolute top-3 left-3 text-[10px] font-serif font-bold text-ink-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-ink-100/50 z-20">
                        {hex.id}
                    </div>

                    {/* Luck Badge - Top Right */}
                    <div className={`absolute top-3 right-3 text-[10px] font-sans font-bold px-2 py-0.5 rounded-md border ${style.badge} z-20 shadow-sm`}>
                        {hex.luck}
                    </div>
                    
                    <div className="relative z-10 mb-3 transition-opacity">
                        <HexagramSymbol lines={hex.symbol} size="sm" className="group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="relative z-10 w-full">
                        <h3 className={`text-2xl font-serif font-bold mb-1 ${style.text}`}>{hex.name}</h3>
                        <p className={`text-xs uppercase tracking-wide font-sans mb-1 truncate w-full px-2 ${style.text} opacity-80`}>{hex.pinyin}</p>
                        <p className={`text-[10px] font-sans truncate w-full px-2 pb-3 ${style.text} opacity-70`}>{hex.english}</p>
                        
                        {/* Composition Footer */}
                        <div className="w-full flex justify-center items-center gap-2 text-[10px] font-sans border-t border-black/10 pt-2 mt-1 bg-white/40 rounded-b-lg shadow-sm backdrop-blur-[2px]">
                            <div className="flex flex-col items-center leading-none gap-0.5">
                                <span className="text-[8px] uppercase tracking-wider opacity-60">Upper 上卦</span>
                                <span className={`font-medium flex items-center gap-1 ${style.text}`}>
                                    {upper?.nature} <span className="font-serif">{upper?.name}</span>
                                </span>
                            </div>
                            <div className="h-5 w-px bg-black/10 mx-1"></div>
                            <div className="flex flex-col items-center leading-none gap-0.5">
                                <span className="text-[8px] uppercase tracking-wider opacity-60">Lower 下卦</span>
                                <span className={`font-medium flex items-center gap-1 ${style.text}`}>
                                    {lower?.nature} <span className="font-serif">{lower?.name}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    </div>
                );
            })}
            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-ink-50 border-t border-ink-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-ink-400 font-serif italic text-sm">
                "The changes are what has enabled the holy sages to reach all depths and to grasp the seeds of all things."
            </p>
             <p className="text-ink-300 text-xs mt-4 font-sans">
                Powered by Google Gemini
            </p>
        </div>
      </footer>

      {/* Detail Modal */}
      <HexagramModal 
        hexagram={selectedHexagram} 
        isOpen={!!selectedHexagram} 
        onClose={() => setSelectedHexagram(null)} 
      />

      {/* Divination Modal */}
      <DivinationModal 
        isOpen={isDivinationOpen}
        onClose={() => setIsDivinationOpen(false)}
        onComplete={handleDivinationComplete}
      />
    </div>
  );
};

export default App;