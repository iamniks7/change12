import React from 'react';
import { Unit } from '../types';
import { cn } from '../lib/utils';

interface Props {
  value: Unit;
  onChange: (unit: Unit) => void;
}

export function UnitSelector({ value, onChange }: Props) {
  const units: { value: Unit; label: string }[] = [
    { value: 'px', label: 'PX' },
    { value: 'cm', label: 'CM' },
    { value: 'mm', label: 'MM' },
    { value: 'inch', label: 'INCH' },
    { value: 'ft', label: 'FT' },
  ];

  return (
    <div className="flex rounded-xl overflow-hidden border border-gray-300 p-1 bg-gray-50">
      {units.map((unit) => (
        <button
          key={unit.value}
          onClick={() => onChange(unit.value)}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all',
            value === unit.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          {unit.label}
        </button>
      ))}
    </div>
  );
}