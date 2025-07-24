import type { PagedResult } from "@/types/paged-result"
import type { TourService } from "@/types/tour-service"
import type { TourServiceBooking } from "@/types/invoice"
import type { ApiResponse } from "@/types/api"
import http from "@/utils/http"

/**
 * Lấy danh sách tour services của một hướng dẫn viên
 * GET /tour-services/services-of
 */
export const getTourServicesOf = async (
  tourGuideId: number | string,
  page: number | string,
  limit: number | string,
  signal?: AbortSignal,
) => {
  const res = await http.get<PagedResult<TourService>>("tour-services/services-of", {
    params: {
      pageSize: limit,
      pageIndex: page,
      tourGuideId: tourGuideId,
    },
    signal,
  })
  return res.data
}

/**
 * Lấy thông tin chi tiết của một tour service
 * GET /tour-services/{serviceId}
 */
export const getTourService = async (serviceId: number | string, signal?: AbortSignal) => {
  const res = await http.get<ApiResponse<TourServiceBooking>>(`tour-services/${serviceId}`, {
    signal,
  })
  return res.data
}

/**
 * Lấy danh sách tất cả tour services
 * GET /tour-services
 */
export const getTourServices = async (signal?: AbortSignal) => {
  const res = await http.get<ApiResponse<TourServiceBooking[]>>("tour-services", {
    signal,
  })
  return res.data
}

/**
 * Tạo tour service mới
 * POST /tour-services
 */
export const createTourService = async (data: Partial<TourService>, signal?: AbortSignal) => {
  const res = await http.post<ApiResponse<TourService>>("tour-services", data, {
    signal,
  })
  return res.data
}

/**
 * Cập nhật tour service
 * PUT /tour-services/{serviceId}
 */
export const updateTourService = async (
  serviceId: number | string,
  data: Partial<TourService>,
  signal?: AbortSignal,
) => {
  const res = await http.put<ApiResponse<TourService>>(`tour-services/${serviceId}`, data, {
    signal,
  })
  return res.data
}

/**
 * Xóa tour service
 * DELETE /tour-services/{serviceId}
 */
export const deleteTourService = async (serviceId: number | string, signal?: AbortSignal) => {
  const res = await http.delete<ApiResponse<void>>(`tour-services/${serviceId}`, {
    signal,
  })
  return res.data
}
