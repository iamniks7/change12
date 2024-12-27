import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { ImageFile } from '../types';
import { SingleImageView } from './SingleImageView';
import { GridImageView } from './GridImageView';
import { MAX_IMAGES, ACCEPTED_IMAGE_TYPES } from '../lib/constants';

interface Props {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  selectedAction: 'crop' | 'rotate' | null;
  onImageAction: (image: ImageFile) => void;
}

export function ImageUploader({ images, onImagesChange, selectedAction, onImageAction }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = MAX_IMAGES - images.length;
      const filesToProcess = acceptedFiles.slice(0, remainingSlots);

      Promise.all(
        filesToProcess.map((file) => {
          return new Promise<ImageFile>((resolve) => {
            const img = new Image();
            img.onload = () => {
              URL.revokeObjectURL(img.src);
              resolve({
                file,
                preview: URL.createObjectURL(file),
                dimensions: {
                  width: img.width,
                  height: img.height,
                },
              });
            };
            img.src = URL.createObjectURL(file);
          });
        })
      ).then((newImages) => {
        onImagesChange([...images, ...newImages]);
      });
    },
    [images, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: MAX_IMAGES - images.length,
    disabled: images.length >= MAX_IMAGES,
  });

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  if (images.length === 0) {
    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive 
            ? 'Drop the images here...' 
            : `Drag & drop images here, or click to select (${images.length}/${MAX_IMAGES})`}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: JPG, JPEG, PNG, WEBP, HEIC
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {images.length < MAX_IMAGES && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive 
              ? 'Drop the images here...' 
              : `Drag & drop images here, or click to select (${images.length}/${MAX_IMAGES})`}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: JPG, JPEG, PNG, WEBP, HEIC
          </p>
        </div>
      )}

      {images.length === 1 ? (
        <SingleImageView 
          image={images[0]} 
          onRemove={() => removeImage(0)}
          selectedAction={selectedAction}
          onImageAction={() => onImageAction(images[0])}
        />
      ) : (
        <GridImageView 
          images={images} 
          onRemove={removeImage}
          selectedAction={selectedAction}
          onImageAction={onImageAction}
        />
      )}
    </div>
  );
}