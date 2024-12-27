import React from 'react';
import { Crop, RotateCw } from 'lucide-react';

interface Props {
  action: 'crop' | 'rotate';
  onActionClick: () => void;
}

export function ImageActions({ action, onActionClick }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <button 
        onClick={onActionClick}
        className="px-4 py-2 bg-white bg-opacity-90 rounded-lg shadow-lg
          text-sm font-medium flex items-center gap-2 hover:bg-opacity-100 transition-all"
      >
        {action === 'crop' ? (
          <>
            <Crop className="h-4 w-4" />
            Crop Image
          </>
        ) : (
          <>
            <RotateCw className="h-4 w-4" />
            Rotate Image
          </>
        )}
      </button>
    </div>
  );
}