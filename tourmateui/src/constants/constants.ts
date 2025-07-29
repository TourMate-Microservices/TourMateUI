// Sử dụng environment variable từ Docker Compose cho base URL
const getBaseUrl = () => {
  // Ưu tiên env variable từ Docker, fallback về logic cũ
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  if (typeof window !== 'undefined') {
    // Client side - sử dụng hostname hiện tại với protocol phù hợp
    const protocol = window.location.protocol;
    return `${protocol}//${window.location.hostname}`;
  }
  // Server side - fallback
  return "http://localhost";
};

const baseUrl = getBaseUrl();

export const userServiceUrl = `${baseUrl}/user-service/api/v1`;
export const tourServiceUrl = `${baseUrl}/tour-service/api/v1`;
export const paymentServiceUrl = `${baseUrl}/payment-service/api/v1`;
export const messageServiceUrl = `${baseUrl}/message-service/api/v1`;

export const messageHub = `${baseUrl}/message-service`;

export const webURL = baseUrl;
