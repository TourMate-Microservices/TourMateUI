import { Invoice, MonthlyScheduleRequest, MonthlyScheduleResponse, TourGuideSchedule, TourServiceBooking } from "@/types/invoice"
import { CreateInvoiceRequest } from "@/types/api"
import { createInvoice, getInvoices, getMonthlySchedule, updateInvoiceStatus, updatePaymentStatus } from "@/api/invoice.api"
import { getTourService } from "@/api/tour-service.api"


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
      const response = await getMonthlySchedule({
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
      const response = await getTourService(serviceId)

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
   * Lấy danh sách invoice của service cụ thể
   * Gọi API để lấy invoice history cho sidebar
   */
  static async getInvoices(
    serviceId: number,
    tourGuideId: number,
    startDate?: string,
    endDate?: string,
  ): Promise<Invoice[]> {
    try {
      const response = await getInvoices({
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
   * Tạo invoice mới cho người dùng
   * Gọi API để đặt tour và thanh toán
   */
  static async createInvoice(invoiceData: CreateInvoiceRequest): Promise<Invoice> {
    const response = await createInvoice(invoiceData)

    if (response.success && response.data) {
      this.clearCache()
      return response.data
    } else {
      throw new Error(response.error || "Failed to create booking")
    }
  }

  /**
   * Cập nhật trạng thái invoice
   * Gọi API để confirm/cancel invoice
   */
  static async updateInvoiceStatus(invoiceId: number, status: string): Promise<Invoice> {
    const response = await updateInvoiceStatus(invoiceId, status)

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
  static async updatePaymentStatus(invoiceId: number, paymentStatus: string): Promise<Invoice> {
    const response = await updatePaymentStatus(invoiceId, paymentStatus)

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
