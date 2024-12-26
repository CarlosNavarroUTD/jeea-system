import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface TokenResponse {
  access: string;
  refresh: string;
  user: any;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

// Control de refresco de token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Función para obtener el token almacenado
const getStoredToken = () => localStorage.getItem('access_token');

// Función para manejar el logout
const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Interceptor de solicitudes
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Prevenir caché
    if (config.method?.toLowerCase() !== 'get') {
      config.headers['Cache-Control'] = 'no-cache';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    // Manejar error 401 (No autorizado)
    if (error.response.status === 401 && !originalRequest._retry) {
      // Si es un intento de refresh fallido, logout
      if (originalRequest.url === 'token/refresh/') {
        handleLogout();
        return Promise.reject(error);
      }

      // Si ya está refrescando, poner en cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      // Intentar refresh del token
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      try {
        const { data } = await api.post<TokenResponse>('token/refresh/', {
          refresh: refreshToken
        });

        localStorage.setItem('access_token', data.access);
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
        
        processQueue(null, data.access);
        isRefreshing = false;
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;