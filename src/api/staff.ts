import apiClient from './client';

export const getStaff = async () => {
  const response = await apiClient.get('/auth/staff');
  return response.data;
};

export const updateStaff = async (id: string, data: any) => {
  const response = await apiClient.patch(`/auth/staff/${id}`, data);
  return response.data;
};
