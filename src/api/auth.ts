import apiClient from './client';

export const login = async (credentials: any) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await apiClient.post('/auth/refresh', { refreshToken });
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const logout = async (refreshToken: string) => {
  const response = await apiClient.post('/auth/logout', { refreshToken });
  return response.data;
};
