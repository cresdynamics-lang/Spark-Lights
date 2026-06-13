import type { ImgHTMLAttributes } from 'react';
import { isPublicImageUrl } from '../lib/publicImages';

interface PublicImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
}

/** Renders nothing if src is not a verified /public asset. */
export default function PublicImage({ src, alt = '', className, ...props }: PublicImageProps) {
  if (!isPublicImageUrl(src)) return null;

  return <img src={src!} alt={alt} className={className} {...props} />;
}
