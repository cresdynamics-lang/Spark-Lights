import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/metaPixel';

/**
 * Fires a Meta PageView on every client-side route change.
 * The initial PageView is already fired by the base pixel snippet in index.html,
 * so we skip the first mount to avoid double-counting.
 */
export default function MetaPixel() {
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);

  return null;
}
