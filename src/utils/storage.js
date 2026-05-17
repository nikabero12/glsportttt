import { demoProducts } from '../data/demoProducts.js';

const TOKEN_KEY = 'glsport-admin-token';
const LOCAL_PRODUCTS_KEY = 'glsport-products-fallback';

const API_BASE =
  window.location.port === '5173' ? 'http://127.0.0.1:3001/api' : '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Server request failed');
  }

  return payload;
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loadProducts() {
  try {
    const products = await request('/products');
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    return products;
  } catch {
    const storedProducts = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return storedProducts ? JSON.parse(storedProducts) : demoProducts;
  }
}

export async function loginAdmin(username, password) {
  const payload = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem(TOKEN_KEY, payload.token);
  return true;
}

export function isAdminAuthenticated() {
  return Boolean(getToken());
}

export function setAdminAuthenticated(isAuthenticated) {
  if (!isAuthenticated) {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function createProduct(product) {
  return request('/products', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
}

export async function editProduct(productId, product) {
  return request(`/products/${encodeURIComponent(productId)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
}

export async function removeProduct(productId) {
  return request(`/products/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}
