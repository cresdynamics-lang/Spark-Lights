import apiClient from './client';

export const getCoupons = async () => {
  const response = await apiClient.get('/discounts/coupons');
  return response.data;
};

export const createCoupon = async (data: any) => {
  const response = await apiClient.post('/discounts/coupons', data);
  return response.data;
};
