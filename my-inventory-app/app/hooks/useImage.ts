//app/hooks/iseImage.ts
'use client';

import { useState, useEffect } from 'react';

export function useImage(imagePath: string | null) {
  const [imageUrl, setImageUrl] = useState<string>('/images/placeholder.svg');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imagePath) {
      setIsLoading(false);
      setImageUrl('/images/placeholder.svg');
      return;
    }

    const loadImage = async () => {
      try {
        setIsLoading(true);
        
        // Используем наш API роут для получения изображения
        const apiUrl = `/api/images${imagePath}`;
        const response = await fetch(apiUrl);
        
        if (response.redirected) {
          setImageUrl(response.url);
        } else {
          setImageUrl(imagePath);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        setImageUrl('/images/placeholder.svg'); // ← ДОБАВИЛ ПЛЕЙСХОЛДЕР
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [imagePath]);

  return { imageUrl, isLoading };
}