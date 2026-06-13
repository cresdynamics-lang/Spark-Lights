import { memo, type ImgHTMLAttributes } from 'react';
import { sanitizeProductImageUrl } from '../lib/productImages';

interface ProductImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
}

/** Single render path for catalog images — lazy-loaded, no duplicate fetches per src. */
function ProductImage({ src, alt = '', className, loading = 'lazy', decoding = 'async', ...props }: ProductImageProps) {
  const url = sanitizeProductImageUrl(src);
  if (!url) return null;

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      {...props}
    />
  );
}

export default memo(ProductImage, (prev, next) => prev.src === next.src && prev.alt === next.alt);
