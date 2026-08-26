import { memo, useState, type ImgHTMLAttributes } from 'react';
import { sanitizeProductImageUrl } from '../lib/productImages';

interface ProductImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
}

/**
 * Single render path for catalog images.
 * Fills its container (object-cover) and shows a branded placeholder if the
 * source is missing or fails to load, so a card is never left blank/broken.
 */
function ProductImage({ src, alt = '', className = '', loading = 'lazy', decoding = 'async', ...props }: ProductImageProps) {
  const url = sanitizeProductImageUrl(src);
  const [errored, setErrored] = useState(false);

  if (!url || errored) {
    return (
      <div
        className={`flex items-center justify-center bg-secondary-black text-primary-gold/40 text-[10px] font-black uppercase tracking-[0.2em] ${className}`}
        role="img"
        aria-label={alt || 'Product image unavailable'}
      >
        Spark Lights
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={`block w-full h-full object-cover ${className}`}
      loading={loading}
      decoding={decoding}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}

export default memo(ProductImage, (prev, next) => prev.src === next.src && prev.alt === next.alt && prev.className === next.className);
