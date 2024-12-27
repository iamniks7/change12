import React from 'react';
import { X } from 'lucide-react';
import { ImageFile } from '../types';
import { formatFileSize } from '../lib/utils';
import { ImageActions } from './ImageActions';

interface Props {
  images: ImageFile[];
  onRemove: (index: number) => void;
  selectedAction: 'crop' | 'rotate' | null;
  onImageAction?: (image: ImageFile) => void;
}

export function GridImageView({ images, onRemove, selectedAction, onImageAction }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div
          key={image.preview}
          className="relative group rounded-xl overflow-hidden border border-gray-200"
        >
          <img
            src={image.preview}
            alt={image.file.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30">
            <button
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
            {selectedAction && onImageAction && (
              <ImageActions 
                action={selectedAction} 
                onActionClick={() => onImageAction(image)}
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-3 text-sm">
              <p className="truncate font-medium">{image.file.name}</p>
              <p className="text-gray-300">
                {image.dimensions && 
                  `${image.dimensions.width} × ${image.dimensions.height} | ${formatFileSize(image.file.size)}`}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}