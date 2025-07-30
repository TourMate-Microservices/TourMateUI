// Sử dụng environment variable từ Docker Compose cho base URL
const getBaseUrl = () => {
  // Ưu tiên env variable từ Docker, fallback về logic cũ
  // if (process.env.NEXT_PUBLIC_API_BASE_URL) {
  //   return process.env.NEXT_PUBLIC_API_BASE_URL;
  // }
  // Server side - fallback
  return "https://a6b71b859d10.ngrok-free.app";
};

const baseUrl = getBaseUrl();

export const userServiceUrl = `${baseUrl}/user-service/api/v1`;
export const tourServiceUrl = `${baseUrl}/tour-service/api/v1`;
export const paymentServiceUrl = `${baseUrl}/payment-service/api/v1`;
export const messageServiceUrl = `${baseUrl}/message-service/api/v1`;

export const messageHub = `${baseUrl}/message-service`;

export const webURL = "https://tour-mate-ui.vercel.app";
