import apiClient from './client';

export const getDashboardStats = async () => {
  const response = await apiClient.get('/analytics/dashboard-stats');
  return response.data;
};
