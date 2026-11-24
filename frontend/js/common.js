// Shared utilities
const API = '/api';

const getToken = () => localStorage.getItem('token');
const getUser = () => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};

const setAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// Toast notifications
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Update navbar
const updateNavbar = async () => {
  const user = getUser();
  const authArea = document.getElementById('authArea');
  const cartCount = document.getElementById('cartCount');
  const ordersLink = document.getElementById('ordersLink');
  const adminLink = document.getElementById('adminLink');

  if (authArea) {
    if (user) {
      authArea.innerHTML = `
        <span style="font-weight:600">Hi, ${user.name.split(' ')[0]}</span>
        <a href="#" id="logoutBtn" style="margin-left:1rem">Logout</a>
      `;
      document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        clearAuth();
        window.location.href = '/';
      });
    } else {
      authArea.innerHTML = `<a href="/pages/login.html">Login</a>`;
    }
  }

  if (ordersLink) ordersLink.classList.toggle('hidden', !user);
  if (adminLink) adminLink.classList.toggle('hidden', !user || user.role !== 'admin');

  // Update cart count
  if (user && cartCount) {
    try {
      const cart = await apiFetch('/cart');
      const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      cartCount.textContent = count;
    } catch {}
  }
};

// Mobile menu
const initMobileMenu = () => {
  const btn = document.getElementById('mobileMenuBtn');
  const links = document.querySelector('.nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => links.classList.toggle('active'));
  }
};

// Global search
const initSearch = () => {
  const input = document.getElementById('searchInput');
  const btn = document.getElementById('searchBtn');
  const doSearch = () => {
    if (input.value.trim()) {
      window.location.href = `/pages/products.html?search=${encodeURIComponent(input.value.trim())}`;
    }
  };
  btn?.addEventListener('click', doSearch);
  input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });
};

document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  initMobileMenu();
  initSearch();
});