import { Unit } from '../types';
import { presets } from './utils';

export const handlePresetChange = (
  preset: string,
  selectedUnit: Unit,
  setSelectedPreset: (preset: string) => void,
  setWidth: (width: number) => void,
  setHeight: (height: number) => void
) => {
  setSelectedPreset(preset);
  if (preset !== 'custom') {
    const selectedPreset = presets[selectedUnit].find((p) => p.name === preset);
    if (selectedPreset) {
      setWidth(selectedPreset.width);
      setHeight(selectedPreset.height);
    }
  }
};