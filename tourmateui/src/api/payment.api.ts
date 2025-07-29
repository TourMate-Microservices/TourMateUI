import { CreatePaymentRequest, Payment, PaymentResponse, PaymentResultWithServiceName } from "@/types/payment";
import { paymentServiceHttp } from "@/utils/http";

// Gọi API tạo link thanh toán dùng embedded method (POST + query params)
export const createEmbeddedPaymentLink = async (
  amount: number,
  invoiceId: number,
  signal?: AbortSignal
): Promise<string> => {
  const requestBody = {
    amount,
    invoiceId,
  };

  const response = await paymentServiceHttp.post<PaymentResponse>(
    `payments/create-embedded-payment-link`,
    requestBody,
    {
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    }
  );
  return response.data.url;
};

// // Các hàm hiện có bạn đã viết:
// export const getCreatePaymentUrl = async (
//   amount: number,
//   orderId: string,
//   orderType: string,
//   signal?: AbortSignal
// ): Promise<string> => {
//   const res = await paymentServiceHttp.get<PaymentResponse>("payments/create", {
//     params: { amount, orderId, orderType },
//     signal,
//   });
//   return res.data.url;
// };

export const addPayment = async (data: CreatePaymentRequest) => {
  const response = await paymentServiceHttp.post("payments/create", data);
  return response.data;
};

// API gọi backend sẽ trả về Payment[]
export const getPaymentByAccountId = async (accountId: number) => {
  const response = await paymentServiceHttp.get<Payment[]>(`/payments/byaccount/${accountId}`);
  return response.data;
};

export const fetchPaymentById = async (id: number) => {
  const response = await paymentServiceHttp.get<Payment>(`/payments/${id}`);
  return response.data;
};

export const fetchPaymentResultWithServiceName = async (id: number) => {
  const response = await paymentServiceHttp.get<PaymentResultWithServiceName>(`/payments/with-service-name/${id}`);
  return response.data;
};