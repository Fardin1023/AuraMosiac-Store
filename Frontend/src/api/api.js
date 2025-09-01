import axios from "axios";

// 👇 Adjust backend URL (for dev: localhost:4000, later can be env variable)
const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Categories
export const getCategories = () => API.get("/category");
export const getCategoryById = (id) => API.get(`/category/${id}`);
export const getCategoryByName = (name) => API.get(`/category/getByName/${name}`);

// Products
export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);
export const getProductsByCategory = (categoryId) => API.get(`/products/getByCategory/${categoryId}`);
export const getFeaturedProducts = (count) => API.get(`/products/get/featured/${count}`);
