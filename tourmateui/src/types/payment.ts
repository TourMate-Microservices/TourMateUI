import { Invoice } from "./invoice";

export interface PaymentResponse {
  checkoutUrl: string;
  // thêm các thuộc tính khác nếu cần
}

export type Payment = {
    paymentId: number;
    price: GLfloat;
    status: string;
    createdAt: string;
    paymentType: string;
    paymentMethod: string;
    accountId: number;
    membershipPackageId?: number;
    invoiceId?: number;
    invoice?: Invoice;
}