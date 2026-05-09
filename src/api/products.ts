import apiClient from './client';

export const getProducts = async (params?: any) => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

export const getProductBySlug = async (slug: string) => {
  const response = await apiClient.get(`/products/${slug}`);
  return response.data;
};

export const createProduct = async (data: any) => {
  const response = await apiClient.post('/products', data);
  return response.data;
};
