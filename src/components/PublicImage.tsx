import type { ImgHTMLAttributes } from 'react';
import { sanitizeProductImageUrl } from '../lib/productImages';

interface PublicImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
}

/** Renders product/catalog images from /public or Supabase uploads. */
export default function PublicImage({ src, alt = '', className, loading = 'lazy', decoding = 'async', ...props }: PublicImageProps) {
  const url = sanitizeProductImageUrl(src);
  if (!url) return null;

  return <img src={url} alt={alt} className={className} loading={loading} decoding={decoding} {...props} />;
}
