import React, { useEffect, useState } from 'react';
import type { Store } from '../../types';
import { resolveStoreLogoUrl } from '../../lib/storeLogo';

interface StoreLogoProps {
  store: Store;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  style?: React.CSSProperties;
  fallbackStyle?: React.CSSProperties;
  alt?: string;
  objectFit?: 'cover' | 'contain';
}

export function StoreLogo({
  store,
  className = '',
  imageClassName = '',
  fallbackClassName = '',
  style,
  fallbackStyle,
  alt,
  objectFit = 'contain',
}: StoreLogoProps) {
  const logoUrl = resolveStoreLogoUrl(store);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(logoUrl && !imageFailed);

  useEffect(() => {
    setImageFailed(false);
  }, [logoUrl]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {showImage ? (
        <img
          src={logoUrl!}
          alt={alt || `Logo de ${store.name}`}
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className={`absolute inset-0 h-full w-full ${objectFit === 'cover' ? 'object-cover' : 'object-contain'} ${imageClassName}`}
        />
      ) : (
        <div
          className={`absolute inset-0 flex items-center justify-center ${fallbackClassName}`}
          style={fallbackStyle}
          aria-label={`Iniciales de ${store.name}`}
        >
          {store.logo}
        </div>
      )}
    </div>
  );
}
