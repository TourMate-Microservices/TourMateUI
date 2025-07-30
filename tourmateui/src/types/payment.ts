import { Invoice } from "./invoice";

export interface PaymentResponse {
  url: string;
  // thêm các thuộc tính khác nếu cần
}

export type Payment = {
    paymentId: number;
    price: GLfloat;
    status: string;
    createdAt: string;
    paymentMethod: string;
    accountId: number;
    customerId: number;
    servoceId: number;
    invoiceId: number;
    invoice?: Invoice;
}

export type PaymentResultWithServiceName = {
    paymentId: number;
    price: number;
    serviceId: number;
    serviceName: string;
    createdAt: string;
}

export type CreatePaymentRequest = {
    customerId: number;
    tourGuideId: number;
    invoiceId: number;
    serviceId: number;
    price: number;
    paymentMethod: string;
}