import { useEffect } from 'react';

interface PageSEO {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageSEO({ title, description, path = '', keywords }: PageSEO) {
  useEffect(() => {
    document.title = title;
    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);

    const url = `https://${import.meta.env.VITE_SITE_DOMAIN || 'sparklights.co.ke'}${path}`;
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, keywords]);
}
