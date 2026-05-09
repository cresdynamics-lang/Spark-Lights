import client from './client';

export const getSettings = async () => {
  const response = await client.get('/settings');
  return response.data;
};

export const updateSettings = async (data: any) => {
  const response = await client.patch('/settings', data);
  return response.data;
};