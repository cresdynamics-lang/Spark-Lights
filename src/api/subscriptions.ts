import apiClient from './client';

export const getSubscriptions = async () => {
  const response = await apiClient.get('/subscriptions');
  return response.data;
};

export const createSubscription = async (data: any) => {
  const response = await apiClient.post('/subscriptions', data);
  return response.data;
};
