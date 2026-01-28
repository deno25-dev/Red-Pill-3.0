import React, { useRef, useState, useLayoutEffect } from 'react';
import { 
  CandlestickChart, 
  Settings, 
  Database, 
  Layers, 
  Search, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { ChartPlaceholder } from '@/components/ChartPlaceholder';
import { ChartDimensions } from '@/types';

const SIDEBAR_WIDTH = 48;
const WATCHLIST_WIDTH = 260;

export const MainLayout: React.FC = () => {
  // References
  const centerContainerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [dimensions, setDimensions] = useState<ChartDimensions>({ width: 0, height: 0 });
  const [isStable, setIsStable] = useState(false);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ResizeObserver Logic with Delay
  useLayoutEffect(() => {
    if (!centerContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      // Clear any pending stabilization timer
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      // We are resizing, so we are not stable
      setIsStable(false);

      // Only allow the chart to render/update after 100ms of layout silence
      resizeTimeoutRef.current = setTimeout(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
          setIsStable(true);
        }
      }, 100);
    });

    observer.observe(centerContainerRef.current);

    return () => {
      observer.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-rpc-950 text-rpc-text font-sans">
      
      {/* 1. Left Toolbar (Fixed 48px) */}
      <aside className={cn(
        "flex flex-col items-center py-4 bg-rpc-900 border-r border-rpc-800 z-20",
        `w-[${SIDEBAR_WIDTH}px] min-w-[${SIDEBAR_WIDTH}px]`
      )}>
        <div className="mb-8">
          <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center font-bold text-white shadow-lg shadow-red-900/20">
            R
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-4 w-full items-center">
          <ToolbarButton icon={<CandlestickChart size={20} />} active />
          <ToolbarButton icon={<Database size={20} />} />
          <ToolbarButton icon={<Layers size={20} />} />
        </nav>

        <div className="mt-auto flex flex-col gap-4 w-full items-center">
          <ToolbarButton icon={<Settings size={20} />} />
        </div>
      </aside>

      {/* 2. Center Chart Area (Flexible) */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-rpc-950">
        
        {/* Top Header / Symbol Info */}
        <header className="h-12 border-b border-rpc-800 bg-rpc-900 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-4">
             <h1 className="font-bold text-lg tracking-wide">BTC/USD</h1>
             <span className="text-xs bg-rpc-800 px-2 py-1 rounded text-rpc-muted">BINANCE</span>
             <span className="text-sm text-green-500 font-mono">64,231.50</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-rpc-800 rounded text-rpc-muted hover:text-white transition-colors">
              <Activity size={18} />
            </button>
          </div>
        </header>

        {/* Chart Container */}
        <div 
          ref={centerContainerRef} 
          className="flex-1 relative w-full h-full overflow-hidden"
        >
          {/* 
            This is where the Lightweight Chart will live.
            We pass dimensions down so the canvas can be sized exactly without layout thrashing.
          */}
          <ChartPlaceholder dimensions={dimensions} isReady={isStable} />
        </div>
      </main>

      {/* 3. Right Watchlist (Fixed 260px) */}
      <aside className={cn(
        "flex flex-col bg-rpc-900 border-l border-rpc-800 z-20",
        `w-[${WATCHLIST_WIDTH}px] min-w-[${WATCHLIST_WIDTH}px]`
      )}>
        <div className="h-12 border-b border-rpc-800 flex items-center px-3 gap-2 shrink-0">
          <Search size={16} className="text-rpc-muted" />
          <input 
            type="text" 
            placeholder="Symbol search..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder-rpc-muted"
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-2 text-xs font-semibold text-rpc-muted uppercase tracking-wider">
            Favorites
          </div>
          <WatchlistItem symbol="BTC/USD" price="64,231.50" change={1.2} />
          <WatchlistItem symbol="ETH/USD" price="3,452.10" change={-0.5} />
          <WatchlistItem symbol="SOL/USD" price="145.20" change={4.3} />
          <WatchlistItem symbol="SPX" price="5,100.20" change={0.1} />
          
          <div className="px-3 py-2 mt-4 text-xs font-semibold text-rpc-muted uppercase tracking-wider">
            Indices
          </div>
          <WatchlistItem symbol="NDX" price="18,200.50" change={-1.2} />
          <WatchlistItem symbol="DJI" price="39,100.00" change={0.4} />
        </div>

        <div className="p-3 border-t border-rpc-800 shrink-0 flex justify-between items-center text-xs text-rpc-muted">
          <span>Local Data: Connected</span>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </aside>
    </div>
  );
};

// --- Subcomponents for UI Shell ---

const ToolbarButton: React.FC<{ icon: React.ReactNode; active?: boolean }> = ({ icon, active }) => (
  <button className={cn(
    "p-2.5 rounded-lg transition-all duration-200 group relative",
    active ? "bg-rpc-800 text-rpc-accent" : "text-rpc-muted hover:bg-rpc-800 hover:text-white"
  )}>
    {icon}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-rpc-accent rounded-r-full -ml-[1px]" />}
  </button>
);

const WatchlistItem: React.FC<{ symbol: string; price: string; change: number }> = ({ symbol, price, change }) => {
  const isPositive = change >= 0;
  return (
    <div className="flex items-center justify-between px-3 py-2.5 hover:bg-rpc-800/50 cursor-pointer border-l-2 border-transparent hover:border-rpc-700 transition-colors">
      <div className="flex flex-col">
        <span className="font-bold text-sm text-gray-200">{symbol}</span>
        <span className="text-xs text-rpc-muted">Vol: 24M</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-mono text-sm">{price}</span>
        <div className={cn("flex items-center text-xs font-medium", isPositive ? "text-green-500" : "text-red-500")}>
          {isPositive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
          {Math.abs(change)}%
        </div>
      </div>
    </div>
  );
};