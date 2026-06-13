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

export const uploadProductImage = async (imageData: string, filename?: string) => {
  const response = await apiClient.post('/products/upload-image', { imageData, filename });
  return response.data;
};

export const updateProduct = async (id: string, data: any) => {
  const response = await apiClient.patch(`/products/${id}`, data);
  return response.data;
};
