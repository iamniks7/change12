import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResizeControls } from './components/ResizeControls';
import { CropModal } from './components/CropModal';
import { RotateModal } from './components/RotateModal';
import { ImageFile, Unit, SizeUnit, ImageFormat } from './types';
import { handlePresetChange } from './lib/presetHandlers';
import { Eye, Download } from 'lucide-react';

export default function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit>('px');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [dpi, setDpi] = useState<number | ''>('');
  const [targetSize, setTargetSize] = useState<number | ''>('');
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('MB');
  const [format, setFormat] = useState<ImageFormat>('original');
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const [adjustMode, setAdjustMode] = useState<'fill' | 'fit' | 'stretch'>('fill');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'crop' | 'rotate' | null>(null);
  const [cropImage, setCropImage] = useState<ImageFile | null>(null);
  const [rotateImage, setRotateImage] = useState<ImageFile | null>(null);

  useEffect(() => {
    if (images.length === 1 && images[0].dimensions) {
      setWidth(images[0].dimensions.width);
      setHeight(images[0].dimensions.height);
    } else if (images.length === 0 || images.length > 1) {
      setWidth('');
      setHeight('');
    }
  }, [images]);

  const handlePresetChangeWrapper = (preset: string) => {
    handlePresetChange(preset, selectedUnit, setSelectedPreset, setWidth, setHeight);
  };

  const handleImageAction = (image: ImageFile) => {
    if (selectedAction === 'crop') {
      setCropImage(image);
    } else if (selectedAction === 'rotate') {
      setRotateImage(image);
    }
  };

  const handleCropApply = (croppedImageUrl: string, croppedFile: File) => {
    if (cropImage) {
      const img = new Image();
      img.onload = () => {
        const updatedImage = {
          file: croppedFile,
          preview: croppedImageUrl,
          dimensions: {
            width: img.width,
            height: img.height,
          },
        };

        const updatedImages = images.map(img => 
          img === cropImage ? updatedImage : img
        );

        setImages(updatedImages);
        setCropImage(null);
      };
      img.src = croppedImageUrl;
    }
  };

  const handleRotateApply = (rotatedImageUrl: string, rotatedFile: File) => {
    if (rotateImage) {
      const img = new Image();
      img.onload = () => {
        const updatedImage = {
          file: rotatedFile,
          preview: rotatedImageUrl,
          dimensions: {
            width: img.width,
            height: img.height,
          },
        };

        const updatedImages = images.map(img => 
          img === rotateImage ? updatedImage : img
        );

        setImages(updatedImages);
        setRotateImage(null);
      };
      img.src = rotatedImageUrl;
    }
  };

  const handlePreviewAndDownload = async () => {
    setIsProcessing(true);
    try {
      // Implement preview and download logic here
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Resizer Pro
          </h1>
          <p className="text-lg text-gray-600">
            Resize, crop, and optimize your images with ease
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ImageUploader 
              images={images} 
              onImagesChange={setImages}
              selectedAction={selectedAction}
              onImageAction={handleImageAction}
            />
            
            {images.length > 0 && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setSelectedAction(selectedAction === 'crop' ? null : 'crop')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all
                    ${selectedAction === 'crop'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Crop
                </button>
                <button
                  onClick={() => setSelectedAction(selectedAction === 'rotate' ? null : 'rotate')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all
                    ${selectedAction === 'rotate'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Rotate
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <ResizeControls
              selectedUnit={selectedUnit}
              width={width}
              height={height}
              maintainAspectRatio={maintainAspectRatio}
              dpi={dpi}
              targetSize={targetSize}
              sizeUnit={sizeUnit}
              format={format}
              selectedPreset={selectedPreset}
              adjustMode={adjustMode}
              onUnitChange={setSelectedUnit}
              onWidthChange={setWidth}
              onHeightChange={setHeight}
              onToggleAspectRatio={() => setMaintainAspectRatio(!maintainAspectRatio)}
              onDpiChange={setDpi}
              onTargetSizeChange={setTargetSize}
              onSizeUnitChange={setSizeUnit}
              onFormatChange={setFormat}
              onPresetChange={handlePresetChangeWrapper}
              onAdjustModeChange={setAdjustMode}
              images={images}
            />

            {images.length > 0 && (
              <div className="flex gap-4">
                <button
                  onClick={handlePreviewAndDownload}
                  disabled={isProcessing}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-transparent 
                    text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all
                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5" />
                      <Download className="h-5 w-5" />
                      Preview and Download
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {cropImage && (
        <CropModal
          image={cropImage}
          onClose={() => {
            setCropImage(null);
            setSelectedAction(null);
          }}
          onApply={handleCropApply}
        />
      )}

      {rotateImage && (
        <RotateModal
          image={rotateImage}
          onClose={() => {
            setRotateImage(null);
            setSelectedAction(null);
          }}
          onApply={handleRotateApply}
        />
      )}
    </div>
  );
}