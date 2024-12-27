import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { CropPresets } from './CropPresets';
import { ImageFile } from '../types';
import { cn } from '../lib/utils';
import { dataURLtoFile } from '../lib/imageUtils';

interface Props {
  image: ImageFile;
  onClose: () => void;
  onApply: (croppedImage: string, file: File) => void;
}

export function CropModal({ image, onClose, onApply }: Props) {
  const [cropper, setCropper] = useState<Cropper>();
  const [selectedRatio, setSelectedRatio] = useState<string>('free');
  const [cropData, setCropData] = useState({ width: 0, height: 0 });
  const [cropShape, setCropShape] = useState<'rectangle' | 'circle'>('rectangle');

  const updateCropData = useCallback(() => {
    if (cropper) {
      const data = cropper.getData();
      setCropData({
        width: Math.round(data.width),
        height: Math.round(data.height)
      });
    }
  }, [cropper]);

  const handleApply = () => {
    if (cropper) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const croppedCanvas = cropper.getCroppedCanvas();
      
      if (cropShape === 'circle') {
        canvas.width = croppedCanvas.width;
        canvas.height = croppedCanvas.height;
        
        if (ctx) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            Math.min(canvas.width, canvas.height) / 2,
            0,
            Math.PI * 2
          );
          ctx.clip();
          ctx.drawImage(croppedCanvas, 0, 0);
          ctx.restore();

          // Convert to PNG with transparency
          const finalCanvas = document.createElement('canvas');
          finalCanvas.width = canvas.width;
          finalCanvas.height = canvas.height;
          const finalCtx = finalCanvas.getContext('2d');

          if (finalCtx) {
            finalCtx.save();
            finalCtx.beginPath();
            finalCtx.arc(
              finalCanvas.width / 2,
              finalCanvas.height / 2,
              Math.min(finalCanvas.width, finalCanvas.height) / 2,
              0,
              Math.PI * 2
            );
            finalCtx.clip();
            finalCtx.drawImage(canvas, 0, 0);
            finalCtx.restore();

            const croppedDataUrl = finalCanvas.toDataURL('image/png');
            const newFileName = image.file.name.replace(/\.[^/.]+$/, '') + '.png';
            const croppedFile = dataURLtoFile(croppedDataUrl, newFileName);
            onApply(croppedDataUrl, croppedFile);
          }
        }
      } else {
        const croppedDataUrl = croppedCanvas.toDataURL(image.file.type);
        const croppedFile = dataURLtoFile(croppedDataUrl, image.file.name);
        onApply(croppedDataUrl, croppedFile);
      }
    }
  };

  const handleRatioChange = (ratio: string) => {
    setSelectedRatio(ratio);
    if (cropper) {
      if (ratio === 'free') {
        cropper.setAspectRatio(NaN);
      } else if (ratio === 'original') {
        const { width, height } = image.dimensions || { width: 1, height: 1 };
        cropper.setAspectRatio(width / height);
      } else {
        const [width, height] = ratio.split(':').map(Number);
        cropper.setAspectRatio(width / height);
      }
    }
  };

  // Calculate max height for the container
  const getContainerStyle = () => {
    if (!image.dimensions) return {};
    
    const viewportHeight = window.innerHeight;
    const maxHeight = viewportHeight * 0.5; // 50% of viewport height
    const imageRatio = image.dimensions.width / image.dimensions.height;
    
    if (image.dimensions.height > image.dimensions.width) {
      // Portrait image
      return { height: maxHeight, width: 'auto' };
    } else {
      // Landscape image
      const width = maxHeight * imageRatio;
      return { height: maxHeight, width };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-xl w-[90vw] max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Crop Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setCropShape('rectangle');
                if (cropper) {
                  cropper.setAspectRatio(NaN);
                }
              }}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors',
                cropShape === 'rectangle'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              Rectangle
            </button>
            <button
              onClick={() => {
                setCropShape('circle');
                if (cropper) {
                  cropper.setAspectRatio(1);
                }
              }}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors',
                cropShape === 'circle'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              Circle
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <div 
            className={cn(
              "max-w-full mx-auto",
              cropShape === 'circle' ? 'cropper-circle-container' : ''
            )}
            style={getContainerStyle()}
          >
            <Cropper
              src={image.preview}
              style={{ height: '100%', width: '100%' }}
              initialAspectRatio={cropShape === 'circle' ? 1 : undefined}
              aspectRatio={cropShape === 'circle' ? 1 : undefined}
              guides={true}
              viewMode={1}
              cropBoxResizable={true}
              cropBoxMovable={true}
              toggleDragModeOnDblclick={true}
              onInitialized={(instance) => setCropper(instance)}
              crop={updateCropData}
              className={cn(
                "max-h-full",
                cropShape === 'circle' ? 'cropper-circle' : ''
              )}
            />
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            Original: {image.dimensions?.width} × {image.dimensions?.height} px | 
            Cropped: {cropData.width} × {cropData.height} px
          </div>
        </div>

        <div className="p-4 border-t space-y-4">
          {cropShape === 'rectangle' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aspect Ratio
              </label>
              <CropPresets selectedRatio={selectedRatio} onRatioChange={handleRatioChange} />
            </div>
          )}
          
          <div className="flex justify-end gap-3">
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
              Apply Cropping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}