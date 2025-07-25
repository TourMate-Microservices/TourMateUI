import type { PagedResult } from "@/types/paged-result"
import type { Invoice, TourGuideSchedule, MonthlyInvoiceStatistics } from "@/types/invoice"
import type {
  PaginatedResponse,
  GetMonthlyScheduleParams,
  GetInvoicesParams,
  CreateInvoiceRequest,
} from "@/types/api"
import {http} from "@/utils/http"

/**
 * Lấy lịch trình của hướng dẫn viên theo tháng
 * GET /schedules/monthly
 */
export const getMonthlySchedule = async (params: GetMonthlyScheduleParams, signal?: AbortSignal) => {
  const res = await http.get<TourGuideSchedule[]>(`tour-service/api/v1/invoices/schedules/monthly`, {
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

  const res = await http.get<PaginatedResponse<Invoice>>("tour-service/api/v1/invoices", {
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

  const res = await http.get<PagedResult<Invoice>>("tour-service/api/v1/invoices/paged", {
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
  const res = await http.get<Invoice>(`tour-service/api/v1/invoices/${bookingId}`, {
    signal,
  })
  return res.data
}

/**
 * Tạo booking mới
 * POST /invoices
 */
export const createInvoice = async (data: CreateInvoiceRequest, signal?: AbortSignal) => {
  const res = await http.post<Invoice>("tour-service/api/v1/invoices", data, {
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
  const res = await http.put<Invoice>(`tour-service/api/v1/invoices/${bookingId}`, data, {
    signal,
  })
  return res.data
}

/**
 * Cập nhật trạng thái invoice
 * PATCH /invoices/{invoiceId}/status
 */
export const updateInvoiceStatus = async (invoiceId: number | string, status: string, signal?: AbortSignal) => {
  const res = await http.patch<Invoice>(
    `tour-service/api/v1/invoices/${invoiceId}/status`,
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
  const res = await http.patch<Invoice>(
    `tour-service/api/v1/invoices/${invoiceId}/payment-status`,
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
  const res = await http.delete<void>(`tour-service/api/v1/invoices/${invoiceId}`, {
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
  const res = await http.get<MonthlyInvoiceStatistics>("tour-service/api/v1/invoices/statistics/monthly", {
    params: {
      tourGuideId,
      year,
      month,
    },
    signal,
  })
  return res.data
}
