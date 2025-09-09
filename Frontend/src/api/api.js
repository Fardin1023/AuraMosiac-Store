import axios from "axios";

// Products API (port 4000)
const API = axios.create({ baseURL: "http://localhost:4000/api" });

// ✅ Auth/User API (port 5000)
export const AUTH = axios.create({ baseURL: "http://localhost:5000/api" });

// attach token automatically if available (for AUTH baseURL)
AUTH.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- CATEGORIES ----------
export const getCategories = () => API.get("/category");
export const getCategoryById = (id) => API.get(`/category/${id}`);

// ---------- PRODUCTS ----------
export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);
export const getProductsByCategory = (categoryId) =>
  API.get(`/products/getByCategory/${categoryId}`);
export const getFeaturedProducts = (count) =>
  API.get(`/products/get/featured/${count}`);
export const getProductsByCategoryName = (name) =>
  API.get(`/products/byCategoryName/${encodeURIComponent(name)}`);
export const searchProducts = (params) =>
  API.get("/products/search", { params });
export const getRelatedProducts = (categoryId, excludeId) =>
  API.get(`/products/related/${categoryId}/${excludeId}`);

/* ---------- REVIEWS (products, needs auth but lives on port 4000) ---------- */
const withAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProductReviews = (productId) =>
  API.get(`/products/${productId}/reviews`);

export const addProductReview = (productId, payload) =>
  API.post(`/products/${productId}/reviews`, payload, {
    headers: withAuthHeader(),
  });

export const deleteProductReview = (productId, reviewId) =>
  API.delete(`/products/${productId}/reviews/${reviewId}`, {
    headers: withAuthHeader(),
  });

// ---------- AUTH / USER ----------
export const googleAuth = (credential) => AUTH.post("/auth/google", { credential });
export const getMe = () => AUTH.get("/auth/me");
export const updateMe = (body) => AUTH.patch("/users/me", body);
export const logout = () => AUTH.post("/auth/logout");

// ---------- ORDERS / TRANSACTIONS ----------
export const createOrder = (payload) => AUTH.post("/orders", payload);
export const getMyOrders = () => AUTH.get("/orders/my");
export const getMyTransactions = () => AUTH.get("/transactions/my");

// ---------- AI ----------
export const aiChat = (payload) => API.post("/ai/chat", payload);
export const aiRecommend = (payload) => API.post("/ai/recommend", payload);
export const aiGift = (payload) => API.post("/ai/gift", payload);
