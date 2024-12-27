import React from 'react';
import { cn } from '../lib/utils';

interface Props {
  selectedRatio: string;
  onRatioChange: (ratio: string) => void;
}

export function CropPresets({ selectedRatio, onRatioChange }: Props) {
  const presets = [
    { label: 'FreeForm', value: 'free' },
    { label: 'Original', value: 'original' },
    { label: 'Square', value: '1:1' },
    { label: '9:16', value: '9:16' },
    { label: '16:9', value: '16:9' },
    { label: '4:5', value: '4:5' },
    { label: '5:4', value: '5:4' },
    { label: '3:4', value: '3:4' },
    { label: '4:3', value: '4:3' },
    { label: '2:3', value: '2:3' },
    { label: '3:2', value: '3:2' },
    { label: '5:7', value: '5:7' },
    { label: '7:5', value: '7:5' },
    { label: '1:2', value: '1:2' },
    { label: '2:1', value: '2:1' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.value}
          onClick={() => onRatioChange(preset.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            selectedRatio === preset.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}