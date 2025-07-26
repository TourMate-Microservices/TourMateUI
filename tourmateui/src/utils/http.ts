import axios, { AxiosInstance } from 'axios'
import { paymentServiceUrl, tourServiceUrl, userServiceUrl } from '@/constants/constants';

class Http {
  instance: AxiosInstance

  constructor(apiUrl: string) {
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

export const tourServiceHttp = new Http(tourServiceUrl).instance
export const userServiceHttp = new Http(userServiceUrl).instance
export const paymentServiceHttp = new Http(paymentServiceUrl).instance
