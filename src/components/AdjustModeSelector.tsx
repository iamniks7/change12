import React from 'react';
import { cn } from '../lib/utils';

interface Props {
  value: 'fill' | 'fit' | 'stretch';
  onChange: (mode: 'fill' | 'fit' | 'stretch') => void;
}

export function AdjustModeSelector({ value, onChange }: Props) {
  const modes = [
    { value: 'fill', label: 'Fill' },
    { value: 'fit', label: 'Fit' },
    { value: 'stretch', label: 'Stretch' },
  ] as const;

  return (
    <div className="flex rounded-xl overflow-hidden border border-gray-300 p-1 bg-gray-50">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all',
            value === mode.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}