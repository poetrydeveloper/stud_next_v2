//app/components/ProductImage.tsx

'use client';

import { useImage } from '@/app/hooks/useImage';


interface ProductImageProps {
  imagePath: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ProductImage({ imagePath, alt, className, width, height }: ProductImageProps) {
  const { imageUrl, isLoading } = useImage(imagePath);

  if (isLoading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse rounded ${className}`} 
        style={{ width, height }} 
      />
    );
  }

  return (
    <img 
      src={imageUrl}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={(e) => {
        // Fallback если изображение не загрузилось
        e.currentTarget.src = '/images/placeholder.svg'; // ← ИСПРАВИТЬ НА .svg
      }}
    />
  );
}