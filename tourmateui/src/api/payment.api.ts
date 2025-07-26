import { Payment, PaymentResponse } from "@/types/payment";
import { paymentServiceHttp } from "@/utils/http";

// Gọi API tạo link thanh toán dùng embedded method (POST + query params)
export const createEmbeddedPaymentLink = async (
  amount: number,
  type: string,
  signal?: AbortSignal
): Promise<string> => {
  const queryParams = new URLSearchParams({
    amount: amount.toString(),
    type,
  }).toString();

  const response = await paymentServiceHttp.post<PaymentResponse>(
    `payos/create-embedded-payment-link?${queryParams}`,
    null, // POST nhưng không có body
    {
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    }
  );

  return response.data.checkoutUrl;
};

// Các hàm hiện có bạn đã viết:
export const getCreatePaymentUrl = async (
  amount: number,
  orderId: string,
  orderType: string,
  signal?: AbortSignal
): Promise<string> => {
  const res = await paymentServiceHttp.get<PaymentResponse>("payments/create", {
    params: { amount, orderId, orderType },
    signal,
  });
  return res.data.checkoutUrl;
};

export const addPayment = async (data: Payment) => {
  const response = await paymentServiceHttp.post("payments", data);
  return response.data;
};

// API gọi backend sẽ trả về Payment[]
export const getPaymentByAccountId = async (accountId: number) => {
  const response = await paymentServiceHttp.get<Payment[]>(`/payment/byaccount/${accountId}`);
  return response.data;
};