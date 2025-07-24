import { Invoice, MonthlyScheduleRequest, MonthlyScheduleResponse, TourGuideSchedule, TourServiceBooking } from "@/types/invoice"
import { apiClient } from "./api-client"
import { CreateBookingRequest } from "@/types/api"


export class TourScheduleService {
  private static scheduleCache = new Map<string, TourGuideSchedule[]>()

  /**
   * Lấy lịch trình hướng dẫn viên theo tháng
   * Gọi API để lấy tất cả booking/schedule của HDV trong tháng
   */
  static async getMonthlySchedule(request: MonthlyScheduleRequest): Promise<MonthlyScheduleResponse> {
    const cacheKey = `${request.tourGuideId}-${request.year}-${request.month}`

    if (this.scheduleCache.has(cacheKey)) {
      const schedules = this.scheduleCache.get(cacheKey) || []
      return {
        schedules,
        totalCount: schedules.length,
      }
    }

    try {
      const response = await apiClient.getMonthlySchedule({
        tourGuideId: request.tourGuideId,
        year: request.year,
        month: request.month,
      })

      if (response.success && response.data) {
        this.scheduleCache.set(cacheKey, response.data)
        return {
          schedules: response.data,
          totalCount: response.data.length,
        }
      } else {
        throw new Error("Không tìm thấy lịch trình")
      }
    } catch (error) {
      console.error("Failed to fetch schedule:", error)
      // Return empty schedule thay vì throw
      const emptySchedule = { schedules: [], totalCount: 0 }
      this.scheduleCache.set(cacheKey, [])
      return emptySchedule
    }
  }

  /**
   * Lấy thông tin chi tiết tour service
   * Gọi API để lấy thông tin service, giá, khung giờ có sẵn, etc.
   */
  static async getTourService(serviceId: number): Promise<TourServiceBooking> {
    try {
      const response = await apiClient.getTourService({ serviceId })

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error("Không tìm thấy thông tin tour")
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi tải tour: ${error.message}`)
      }
      throw new Error("Không thể kết nối đến server")
    }
  }

  /**
   * Lấy danh sách booking của service cụ thể
   * Gọi API để lấy booking history cho sidebar
   */
  static async getBookings(
    serviceId: number,
    tourGuideId: number,
    startDate?: string,
    endDate?: string,
  ): Promise<Invoice[]> {
    try {
      const response = await apiClient.getBookings({
        serviceId,
        tourGuideId,
        startDate,
        endDate,
        status: ["confirmed", "pending"],
      })

      if (response.success && response.data) {
        return response.data.items
      } else {
        throw new Error("Không tìm thấy lịch sử booking")
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
      // Return empty array thay vì throw error
      return []
    }
  }

  /**
   * Tạo booking mới cho người dùng
   * Gọi API để đặt tour và thanh toán
   */
  static async createBooking(bookingData: CreateBookingRequest): Promise<Invoice> {
    const response = await apiClient.createBooking(bookingData)

    if (response.success && response.data) {
      this.clearCache()
      return response.data
    } else {
      throw new Error(response.error || "Failed to create booking")
    }
  }

  /**
   * Cập nhật trạng thái booking
   * Gọi API để confirm/cancel booking
   */
  static async updateBookingStatus(bookingId: number, status: string): Promise<Invoice> {
    const response = await apiClient.updateBookingStatus(bookingId, status)

    if (response.success && response.data) {
      this.clearCache()
      return response.data
    } else {
      throw new Error(response.error || "Failed to update booking status")
    }
  }

  /**
   * Cập nhật trạng thái thanh toán
   * Gọi API để update payment status
   */
  static async updatePaymentStatus(bookingId: number, paymentStatus: string): Promise<Invoice> {
    const response = await apiClient.updatePaymentStatus(bookingId, paymentStatus)

    if (response.success && response.data) {
      this.clearCache()
      return response.data
    } else {
      throw new Error(response.error || "Failed to update payment status")
    }
  }

  static clearCache() {
    this.scheduleCache.clear()
  }
}
