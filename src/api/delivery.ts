import apiClient from './client';

export const getDeliveryZones = async () => {
  const response = await apiClient.get('/delivery/zones');
  return response.data;
};

export const getDeliveryManifest = async (date?: string) => {
  const response = await apiClient.get('/delivery/manifest', { params: { date } });
  return response.data;
};
