import axios from './axios.customize';

const API_PREFIX = '/api/catalog';

export const fetchCategories = () => axios.get(`${API_PREFIX}/categories`);

export const fetchProducts = (params) => axios.get(`${API_PREFIX}/products`, { params });

export const fetchLatestProducts = (limit = 8) =>
  axios.get(`${API_PREFIX}/products/latest`, { params: { limit } });

export const fetchBestSellingProducts = (limit = 8) =>
  axios.get(`${API_PREFIX}/products/best-sellers`, { params: { limit } });

export const fetchPromotionProducts = (limit = 8) =>
  axios.get(`${API_PREFIX}/products/promotions`, { params: { limit } });

export const fetchProductDetail = (id) => axios.get(`${API_PREFIX}/products/${id}`);
