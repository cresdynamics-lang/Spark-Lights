import apiClient from './client';

export const getInventory = async () => {
  const response = await apiClient.get('/inventory/flowers');
  return response.data;
};

export const getInventoryAlerts = async () => {
  const response = await apiClient.get('/inventory/alerts');
  return response.data;
};
