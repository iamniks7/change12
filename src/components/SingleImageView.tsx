import React from 'react';
import { X } from 'lucide-react';
import { ImageFile } from '../types';
import { formatFileSize } from '../lib/utils';
import { ImageActions } from './ImageActions';

interface Props {
  image: ImageFile;
  onRemove: () => void;
  selectedAction: 'crop' | 'rotate' | null;
  onImageAction: () => void;
}

export function SingleImageView({ image, onRemove, selectedAction, onImageAction }: Props) {
  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-gray-200">
        <div className="flex justify-center">
          <img
            src={image.preview}
            alt={image.file.name}
            className="max-h-[50vh] w-auto object-contain"
          />
        </div>
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-red-500" />
        </button>
        {selectedAction && (
          <ImageActions 
            action={selectedAction}
            onActionClick={onImageAction}
          />
        )}
      </div>
      
      <div className="text-center space-y-2">
        <p className="font-medium">{image.file.name}</p>
        <p className="text-sm text-gray-600">
          {image.dimensions && 
            `${image.dimensions.width} × ${image.dimensions.height} | ${formatFileSize(image.file.size)}`}
        </p>
      </div>
    </div>
  );
}