import React, { useState, useEffect } from 'react';
import { X, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, RefreshCcw } from 'lucide-react';
import { ImageFile } from '../types';
import { cn } from '../lib/utils';
import { dataURLtoFile } from '../lib/imageUtils';

interface Props {
  image: ImageFile;
  onClose: () => void;
  onApply: (rotatedImage: string, file: File) => void;
}

export function RotateModal({ image, onClose, onApply }: Props) {
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (image.dimensions) {
      const updateContainerSize = () => {
        const viewportHeight = window.innerHeight;
        const maxHeight = viewportHeight * 0.5; // 50% of viewport height
        const maxWidth = window.innerWidth * 0.8; // 80% of viewport width

        let width = image.dimensions.width;
        let height = image.dimensions.height;

        // Calculate dimensions based on rotation
        if (rotation % 180 !== 0) {
          [width, height] = [height, width];
        }

        const ratio = Math.min(
          maxWidth / width,
          maxHeight / height
        );

        setContainerSize({
          width: width * ratio,
          height: height * ratio
        });
      };

      updateContainerSize();
      window.addEventListener('resize', updateContainerSize);
      return () => window.removeEventListener('resize', updateContainerSize);
    }
  }, [image.dimensions, rotation]);

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotation(Number(e.target.value));
  };

  const resetTransforms = () => {
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
  };

  const rotateBy = (degrees: number) => {
    setRotation((prev) => {
      const newRotation = prev + degrees;
      return newRotation >= 360 ? newRotation - 360 : newRotation < 0 ? newRotation + 360 : newRotation;
    });
  };

  const handleApply = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const radians = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));
      const width = img.width * cos + img.height * sin;
      const height = img.width * sin + img.height * cos;

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.translate(width / 2, height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        const rotatedImage = canvas.toDataURL(image.file.type);
        const rotatedFile = dataURLtoFile(rotatedImage, image.file.name);
        onApply(rotatedImage, rotatedFile);
      }
    };

    img.src = image.preview;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-xl w-[90vw] max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Rotate Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="flex justify-center">
            <div 
              className="relative"
              style={{
                width: containerSize.width,
                height: containerSize.height,
                overflow: 'hidden'
              }}
            >
              <img
                src={image.preview}
                alt="Rotate preview"
                className="w-full h-full object-contain transition-transform"
                style={{ 
                  transform: `rotate(${rotation}deg) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`
                }}
              />
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => rotateBy(90)}
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Rotate 90° counterclockwise"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={() => rotateBy(-90)}
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Rotate 90° clockwise"
              >
                <RotateCw className="h-5 w-5" />
              </button>
              <button
                onClick={() => setFlipX(!flipX)}
                className={cn(
                  "p-3 rounded-lg transition-colors",
                  flipX ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                )}
                title="Flip horizontal"
              >
                <FlipHorizontal className="h-5 w-5" />
              </button>
              <button
                onClick={() => setFlipY(!flipY)}
                className={cn(
                  "p-3 rounded-lg transition-colors",
                  flipY ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                )}
                title="Flip vertical"
              >
                <FlipVertical className="h-5 w-5" />
              </button>
              <button
                onClick={resetTransforms}
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Reset all transforms"
              >
                <RefreshCcw className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">-180°</span>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation}
                onChange={handleRotationChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600">180°</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Apply Rotation
          </button>
        </div>
      </div>
    </div>
  );
}