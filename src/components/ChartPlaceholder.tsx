import React from 'react';
import { ChartDimensions } from '@/types';

interface ChartPlaceholderProps {
  dimensions: ChartDimensions;
  isReady: boolean;
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ dimensions, isReady }) => {
  return (
    <div 
      className="absolute inset-0 bg-rpc-950 flex items-center justify-center border border-rpc-800"
      style={{
        width: dimensions.width > 0 ? dimensions.width : '100%',
        height: dimensions.height > 0 ? dimensions.height : '100%',
      }}
    >
      <div className="text-center">
        <h2 className="text-rpc-text font-bold text-xl mb-2">Main Chart Area</h2>
        <p className="text-rpc-muted font-mono text-sm">
          {isReady ? `Ready: ${Math.floor(dimensions.width)}px × ${Math.floor(dimensions.height)}px` : 'Initializing Geometry...'}
        </p>
      </div>
    </div>
  );
};