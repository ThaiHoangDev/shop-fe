import axios from 'axios';
import Order from 'models/Order.model';
import axiosClient from '../axios';

const getOrders = async (): Promise<Order[]> => {
  const response = await axios.get('/api/users/orders');
  return response.data;
};

const getIds = async (): Promise<{ params: { id: string } }[]> => {
  const response = await axios.get('/api/users/order-ids');
  return response.data;
};

const getOrder = async (id: string): Promise<Order> => {
  const response = await axios.get('/api/users/order', { params: { id } });
  return response.data;
};
const getProvincesApi = async (): Promise<any> => {
  const response = await axiosClient.get('/provinces');
  return response.data;
};
const getWardsApi = async (
  province_code: string,
  district_code: string
): Promise<any> => {
  const response = await axiosClient.get(
    `/wards?province_code=${province_code}&district_code=${district_code}`
  );
  return response.data;
};
const getDistrictsApi = async (province_code: string): Promise<any> => {
  const response = await axiosClient.get(
    `/districts?province_code=${province_code}`
  );
  return response.data;
};
const postPhoneApi = async (body: any): Promise<any> => {
  const response = await axiosClient.post(`/sessions/chuchu`, body);
  return response.data;
};
const postAddressInfoApi = async (body: any): Promise<any> => {
  const response = await axiosClient.post(`/addresses`, body);
  return response.data;
};
const getOrderApi = async (): Promise<any> => {
  const response = await axiosClient.get(`/orders/line_items`);
  return response.data;
};
const lockOrderApi = async (body: any): Promise<any> => {
  const response = await axiosClient.post(`/orders/lock_order_items`, body);
  return response.data;
};
const completeOrderApi = async (body: any, params?: any): Promise<any> => {
  if (!!params) {
    const response = await axiosClient.post(
      `/orders/complete_order_items/?${params}`,
      body
    );
    return response.data;
  }
  const response = await axiosClient.post(`/orders/complete_order_items`, body);
  return response.data;
};

const removePromotionApi = async (body: any): Promise<any> => {
  const response = await axiosClient.post(
    `/orders/remove_order_promotions`,
    body
  );
  return response.data;
};

export default {
  getOrders,
  getOrder,
  getIds,
  getProvincesApi,
  getDistrictsApi,
  getWardsApi,
  postPhoneApi,
  postAddressInfoApi,
  getOrderApi,
  lockOrderApi,
  completeOrderApi,
  removePromotionApi,
};
