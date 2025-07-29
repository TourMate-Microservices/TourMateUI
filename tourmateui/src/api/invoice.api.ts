// Chuẩn hoá lại type cho giống các API khác
export interface InvoiceSearchPaged {
  data: Invoice[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}
// Tham số search-by-tourguide-status-paged
export interface SearchByTourGuideStatusPagedParams {
  tourGuideId: number;
  page?: number;
  size?: number;
  status?: string;
  paymentStatus?: string;
}

export interface SearchByCustomerStatusPagedParams {
  customerId: number;
  page?: number;
  size?: number;
  status?: string;
  paymentStatus?: string;
}

import type { PagedResult } from "@/types/response"
import type { Invoice, TourGuideSchedule, MonthlyInvoiceStatistics, InvoiceSchedule } from "@/types/invoice"
import type {
  PaginatedResponse,
  GetMonthlyScheduleParams,
  GetInvoicesParams,
  CreateInvoiceRequest,
} from "@/types/api"
import {tourServiceHttp} from "@/utils/http"


/**
 * Lấy lịch trình để thanh toán
 * GET /invoices/schedule/
 */
export const fetchScheduleByInvoiceId = async (invoiceId: number) => {
  const res = await tourServiceHttp.get<InvoiceSchedule>(`invoices/schedule/${invoiceId}`);
  return res.data;
};
/**
 * Lấy lịch trình của hướng dẫn viên theo tháng
 * GET /schedules/monthly
 */
export const getMonthlySchedule = async (params: GetMonthlyScheduleParams, signal?: AbortSignal) => {
  const res = await tourServiceHttp.get<TourGuideSchedule[]>(`invoices/schedules/monthly`, {
    params: {
      tourGuideId: params.tourGuideId,
      year: params.year,
      month: params.month,
    },
    signal,
  })
  return res.data
}

/**
 * Lấy danh sách invoice theo service và hướng dẫn viên
 * GET /invoices
 */
export const getInvoices = async (params: GetInvoicesParams, signal?: AbortSignal) => {
  const queryParams: Record<string, string | number | string[]> = {
    serviceId: params.serviceId,
    tourGuideId: params.tourGuideId,
  }

  if (params.startDate) queryParams.startDate = params.startDate
  if (params.endDate) queryParams.endDate = params.endDate
  if (params.status) queryParams.status = params.status

  const res = await tourServiceHttp.get<PaginatedResponse<Invoice>>("invoices", {
    params: queryParams,
    signal,
  })
  return res.data
}

/**
 * Lấy danh sách booking với phân trang
 * GET /invoices/paged
 */
export const getInvoicesPaged = async (
  page: number | string,
  limit: number | string,
  tourGuideId?: number | string,
  serviceId?: number | string,
  status?: string[],
  signal?: AbortSignal,
) => {
  const params: Record<string, string | number | string[]> = {
    pageSize: limit,
    pageIndex: page,
  }

  if (tourGuideId) params.tourGuideId = tourGuideId
  if (serviceId) params.serviceId = serviceId
  if (status) params.status = status

  const res = await tourServiceHttp.get<PagedResult<Invoice>>("invoices/paged", {
    params,
    signal,
  })
  return res.data
}

/**
 * Lấy thông tin chi tiết của một booking/invoice
 * GET /invoices/{bookingId}
 */
export const getInvoice = async (bookingId: number | string, signal?: AbortSignal) => {
  const res = await tourServiceHttp.get<Invoice>(`invoices/${bookingId}`, {
    signal,
  })
  return res.data
}

/**
 * Tạo booking mới
 * POST /invoices
 */
export const createInvoice = async (data: CreateInvoiceRequest, signal?: AbortSignal) => {
  const res = await tourServiceHttp.post<Invoice>("invoices", data, {
    signal,
  })
  return res.data
}

/**
 * Cập nhật thông tin invoice
 * PUT /invoices/{bookingId}
 */
export const updateInvoice = async (
  bookingId: number | string,
  data: Partial<CreateInvoiceRequest>,
  signal?: AbortSignal,
) => {
  const res = await tourServiceHttp.put<Invoice>(`invoices/${bookingId}`, data, {
    signal,
  })
  return res.data
}

/**
 * Cập nhật trạng thái invoice
 * PATCH /invoices/{invoiceId}/status
 */
export const updateInvoiceStatus = async (invoiceId: number | string, status: string, signal?: AbortSignal) => {
  const res = await tourServiceHttp.patch<Invoice>(
    `invoices/${invoiceId}/status`,
    { status },
    {
      signal,
    },
  )
  return res.data
}

/**
 * Cập nhật trạng thái thanh toán
 * PATCH /invoices/{invoiceId}/payment-status
 */
export const updatePaymentStatus = async (invoiceId: number | string, paymentStatus: string, signal?: AbortSignal) => {
  const res = await tourServiceHttp.patch<Invoice>(
    `invoices/${invoiceId}/payment-status`,
    { paymentStatus },
    {
      signal,
    },
  )
  return res.data
}

/**
 * Xóa booking
 * DELETE /invoices/{invoiceId}
 */
export const deleteInvoice = async (invoiceId: number | string, signal?: AbortSignal) => {
  const res = await tourServiceHttp.delete<void>(`invoices/${invoiceId}`, {
    signal,
  })
  return res.data
}

/**
 * Lấy thống kê invoice theo tháng
 * GET /invoices/statistics/monthly
 */
export const getMonthlyInvoiceStatistics = async (
  tourGuideId: number | string,
  year: number | string,
  month: number | string,
  signal?: AbortSignal,
) => {
  const res = await tourServiceHttp.get<MonthlyInvoiceStatistics>("invoices/statistics/monthly", {
    params: {
      tourGuideId,
      year,
      month,
    },
    signal,
  })
  return res.data
}

export const searchInvoicesByTourGuideStatusPaged = async (
  params: SearchByTourGuideStatusPagedParams
): Promise<InvoiceSearchPaged> => {
  const res = await tourServiceHttp.get<InvoiceSearchPaged>(
    "/invoices/search-by-tourguide-status-paged",
    { params }
  );
  return res.data;
};

export const searchInvoicesByCustomerStatusPaged = async (
  params: SearchByCustomerStatusPagedParams
): Promise<InvoiceSearchPaged> => {
  const res = await tourServiceHttp.get<InvoiceSearchPaged>(
    "/invoices/search-by-customer-status-paged",
    { params }
  );
  return res.data;
};
