import apiClient from './client';
import type { BlogPost } from '@/types/blog';

export const getPublishedBlogs = async (): Promise<BlogPost[]> => {
  const response = await apiClient.get('/blogs');
  return response.data.data ?? [];
};

export const getBlogBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await apiClient.get(`/blogs/${slug}`);
    return response.data.data ?? null;
  } catch {
    return null;
  }
};

export const getAdminBlogs = async (): Promise<BlogPost[]> => {
  const response = await apiClient.get('/blogs/admin/list');
  return response.data.data ?? [];
};

export const createBlog = async (payload: Partial<BlogPost> & { title: string; sections: BlogPost['sections'] }) => {
  const response = await apiClient.post('/blogs', payload);
  return response.data;
};

export const updateBlog = async (id: string, payload: Partial<BlogPost>) => {
  const response = await apiClient.patch(`/blogs/${id}`, payload);
  return response.data;
};

export const deleteBlog = async (id: string) => {
  const response = await apiClient.delete(`/blogs/${id}`);
  return response.data;
};
