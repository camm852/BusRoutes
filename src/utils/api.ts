import axios from 'axios';
import { IRoute } from '../vite-env.d';

const baseApiUrl = axios.create({
  baseURL: import.meta.env.VITE_API_URL
  // baseURL: 'http://localhost:5000'
});

// request routes
export const getRoutes = async () => {
  const response = await baseApiUrl.get('/routes');
  return response.data;
};

export const getRouteByHour = async (hour: string) => {
  const response = await baseApiUrl.get(`/routes/${hour}`);
  return response.data;
};

export const newRoute = async (data: IRoute) => {
  const response = await baseApiUrl.post('/routes', data);
  return response.data;
};

export const deleteRoute = async (id: number) => {
  const response = await baseApiUrl.delete(`/routes/${id}`);
  return response.data;
};

export const updateRoute = async (data: IRoute) => {
  const response = await baseApiUrl.put('/routes', data);
  return response.data;
};

// rquest auth

export const login = async (data: { email: string; password: string }) => {
  const response = await baseApiUrl.post('/auth', data);
  return response.data;
};

export default baseApiUrl;
