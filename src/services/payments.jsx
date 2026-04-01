import api from './api';

export const createPaymentIntent = async (courseId, currency = 'usd') => {
  const response = await api.post('/payments/create-payment-intent', { courseId, currency });
  return response.data;
};