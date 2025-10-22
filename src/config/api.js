// Centralized API base URL; adjust when backend port or host changes
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const AUTHOR_API = `${API_BASE_URL}/author-api`;
export const USER_API = `${API_BASE_URL}/user-api`;
export const ADMIN_API = `${API_BASE_URL}/admin-api`;
