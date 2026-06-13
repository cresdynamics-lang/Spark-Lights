import { useEffect, useState } from 'react';
import { getPublishedBlogs, getBlogBySlug } from '@/api/blogs';
import { BLOG_POSTS, getBlogBySlug as getStaticBlogBySlug } from '@/data/blogs';
import type { BlogPost } from '@/types/blog';

export function usePublishedBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPublishedBlogs();
        if (!cancelled && data.length > 0) {
          setPosts(data);
          setFromApi(true);
        }
      } catch {
        // keep static fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading, fromApi };
}

export function useBlogPost(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getBlogBySlug(slug);
        if (!cancelled) {
          setPost(data ?? getStaticBlogBySlug(slug) ?? null);
        }
      } catch {
        if (!cancelled) {
          setPost(getStaticBlogBySlug(slug) ?? null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, loading };
}
