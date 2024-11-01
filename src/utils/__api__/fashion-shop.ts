import axios from "axios";
import Product from "models/Product.model";
import Service from "models/Service.model";

const getFlashDealsApi = async (): Promise<Product[]> => {
  const response = await axios.get("/api/fashion-1/products?tag=flash");
  return response.data;
};

const getNewArrivalsApi = async (): Promise<Product[]> => {
  const response = await axios.get("/api/fashion-1/products?tag=new");
  return response.data;
};

const getTrendingItems = async (): Promise<Product[]> => {
  const response = await axios.get("/api/fashion-1/products?tag=trending");
  return response.data;
};

const getServiceList = async (): Promise<Service[]> => {
  const response = await axios.get("/api/fashion-1/service-list");
  return response.data;
};

const getDealOfTheWeekListApi = async () => {
  const response = await axios.get("/api/fashion-1/deal-of-the-week");
  return response.data;
};

const getHotDealList = async () => {
  const response = await axios.get("/api/fashion-1/hot-deals");
  return response.data;
};

export default {
  getFlashDealsApi,
  getNewArrivalsApi,
  getServiceList,
  getHotDealList,
  getTrendingItems,
  getDealOfTheWeekListApi,
};
