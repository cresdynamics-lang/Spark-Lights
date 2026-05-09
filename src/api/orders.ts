import apiClient from './client';

export const getOrders = async (params?: any) => {
  const response = await apiClient.get('/orders', { params });
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string, notes?: string) => {
  const response = await apiClient.patch(`/orders/${id}/status`, { status, internalNotes: notes });
  return response.data;
};
