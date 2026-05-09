import apiClient from './client';

export const getCustomers = async (params: { page?: number; limit?: number; search?: string; isVip?: boolean } = {}) => {
  const response = await apiClient.get('/customers', { params });
  return response.data;
};

export const getCustomerById = async (id: string) => {
  const response = await apiClient.get(`/customers/${id}`);
  return response.data;
};
