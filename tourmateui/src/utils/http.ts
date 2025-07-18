import axios, { AxiosInstance } from 'axios'
import { apiUrl } from '@/constants/constants';

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: apiUrl,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Request interceptor
    this.instance.interceptors.request.use((config) => {
      const token = sessionStorage.getItem('accessToken')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          sessionStorage.clear();
        }
        return Promise.reject(error);
      }
    )
  }
}

const http = new Http().instance
export default http
