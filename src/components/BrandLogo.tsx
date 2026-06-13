import { Link } from 'react-router-dom';
import { LOGO_IMAGE } from '../data/publicCatalog';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkToHome?: boolean;
  showSubtitle?: boolean;
}

const sizes = {
  sm: { img: 'w-9 h-9', spark: 'text-xl', lights: 'text-xl', sub: 'text-[8px]' },
  md: { img: 'w-11 h-11', spark: 'text-2xl sm:text-3xl', lights: 'text-2xl sm:text-3xl', sub: 'text-[9px]' },
  lg: { img: 'w-14 h-14', spark: 'text-4xl', lights: 'text-4xl', sub: 'text-[10px]' },
};

export default function BrandLogo({ size = 'md', linkToHome = true, showSubtitle = true }: BrandLogoProps) {
  const s = sizes[size];

  const content = (
    <div className="flex items-center gap-3 group">
      <div className={`${s.img} rounded-full overflow-hidden ring-2 ring-primary-gold/60 group-hover:ring-primary-gold transition-all shadow-lg shadow-primary-gold/20 flex-shrink-0`}>
        <img src={LOGO_IMAGE} alt="Sparklights logo" className="w-full h-full object-cover" />
      </div>
      <div className="leading-none">
        <div className="flex items-baseline gap-0.5">
          <span className={`font-brand ${s.spark} font-extrabold tracking-tight text-primary-gold`}>
            Spark
          </span>
          <span className={`font-brand ${s.lights} font-light italic tracking-wide text-white group-hover:text-primary-pink transition-colors`}>
            lights
          </span>
        </div>
        {showSubtitle && (
          <span className={`${s.sub} font-sans font-bold uppercase tracking-[0.35em] text-gray-500 block mt-1`}>
            Nairobi · 254
          </span>
        )}
      </div>
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/" className="hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
