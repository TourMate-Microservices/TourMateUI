import type { PagedResult } from "@/types/response"
import type { TourService } from "@/types/tour-service"
import type { TourServiceBooking } from "@/types/invoice"
import { tourServiceHttp } from "@/utils/http"

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
  const res = await tourServiceHttp.get<PagedResult<TourService>>("tour-services/services-of", {
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
  const res = await tourServiceHttp.get<TourServiceBooking>(`tour-services/${serviceId}`, {
    signal,
  })
  return res.data
}

/**
 * Lấy danh sách tất cả tour services
 * GET /tour-services/all
 */
export const getTourServices = async (signal?: AbortSignal) => {
  const res = await tourServiceHttp.get<TourServiceBooking[]>("tour-services/all", {
    signal,
  })
  return res.data
}
/**
 * Tạo tour service mới
 * POST /tour-services
 */
export const createTourService = async (data: Partial<TourService>, areaId: number, signal?: AbortSignal) => {
  const newData = ({...data, areaId})
  console.log(newData);
  
  const res = await tourServiceHttp.post<TourService>("tour-services", newData, {
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
  const res = await tourServiceHttp.put<TourService>(`tour-services/${serviceId}`, data, {
    signal,
  })
  return res.data
}

/**
 * Xóa tour service
 * DELETE /tour-services/{serviceId}
 */
export const deleteTourService = async (serviceId: number | string, signal?: AbortSignal) => {
  const res = await tourServiceHttp.delete<void>(`tour-services/${serviceId}`, {
    signal,
  })
  return res.data
}
