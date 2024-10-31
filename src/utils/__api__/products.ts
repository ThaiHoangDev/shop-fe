import axios from 'axios';
import axiosClient, { API_VERSION, BASE_URL } from '../axios';
import Product from 'models/Product.model';

// get all product slug
const getSlugs = async (): Promise<{ params: { slug: string } }[]> => {
  const response = await axios.get('/api/products/slug-list');
  return response.data;
};

// get product based on slug
const getProduct = async (slug: string): Promise<Product> => {
  const response = await axiosClient.get(`/products/${slug}`);
  return response.data;
};
// get all product
export const getProductsApi = async (limit = 8) => {
  const response = await axiosClient.get('/products');
  return response.data;
};
// get all product by category
export const getProductsByCateApi = async (id: string, limit = 8) => {
  const response = await axiosClient.get(
    `/taxonomies/${id}/products/?per_page=${limit}`
  );
  return response.data;
};
export const getProductsByTaxonsApi = async (
  params: any,
  limit = 16,
  page = 1
) => {
  const response = await axios.get(
    `${BASE_URL}${API_VERSION}products/?${params}&per_page=${limit}&page=${page}`
  );
  return response.data;
};

export const getTaxonsBestAPi = async () => {
  const response = await axiosClient.get(
    `/taxons/?filter_by[best_seller]=true`
  );
  return response.data;
};

export const getAllCategoryApi = async () => {
  const response = await axiosClient.get('/taxonomies?set=nested');
  return response.data;
};
export const getProductsBestSellerApi = async () => {
  const response = await axiosClient.get(
    '/products?filter_by[best_seller]=true&per_page=5'
  );
  return response.data;
};

// search profucts
const searchProducts = async (
  name?: string,
  category?: string
): Promise<any> => {
  const response = await axiosClient.get(
    `/variants?variant_search_term=${name}&is_user=true`
  );
  return response.data;
};

export default { getSlugs, getProduct, searchProducts };
