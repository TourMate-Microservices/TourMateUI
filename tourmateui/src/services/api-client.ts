import type {
  ApiResponse,
  PaginatedResponse,
  GetMonthlyScheduleParams,
  GetTourServiceParams,
  GetBookingsParams,
  CreateBookingRequest,
} from "@/types/api"
import { Invoice, TourGuideSchedule, TourServiceBooking } from "@/types/invoice"

class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
    this.timeout = 10000 // 10 seconds
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout")
        }
        throw error
      }
      throw new Error("Unknown error occurred")
    }
  }

  /**
   * Lấy thông tin chi tiết của một tour service
   * GET /tour-services/{serviceId}
   */
  async getTourService(params: GetTourServiceParams): Promise<ApiResponse<TourServiceBooking>> {
    return this.request<TourServiceBooking>(`/tour-services/${params.serviceId}`)
  }

  /**
   * Lấy danh sách tất cả tour services
   * GET /tour-services
   */
  async getTourServices(): Promise<ApiResponse<TourServiceBooking[]>> {
    return this.request<TourServiceBooking[]>("/tour-services")
  }

  /**
   * Lấy lịch trình của hướng dẫn viên theo tháng
   * GET /schedules/monthly?tourGuideId={id}&year={year}&month={month}
   * Trả về tất cả booking/schedule của HDV trong tháng (từ mọi service)
   */
  async getMonthlySchedule(params: GetMonthlyScheduleParams): Promise<ApiResponse<TourGuideSchedule[]>> {
    const queryParams = new URLSearchParams({
      tourGuideId: params.tourGuideId.toString(),
      year: params.year.toString(),
      month: params.month.toString(),
    })

    return this.request<TourGuideSchedule[]>(`/schedules/monthly?${queryParams}`)
  }

  /**
   * Lấy danh sách booking theo service và hướng dẫn viên
   * GET /bookings?serviceId={id}&tourGuideId={id}&startDate={date}&endDate={date}&status={status}
   * Trả về booking của service cụ thể (để hiển thị trong sidebar)
   */
  async getBookings(params: GetBookingsParams): Promise<ApiResponse<PaginatedResponse<Invoice>>> {
    const queryParams = new URLSearchParams({
      serviceId: params.serviceId.toString(),
      tourGuideId: params.tourGuideId.toString(),
    })

    if (params.startDate) queryParams.append("startDate", params.startDate)
    if (params.endDate) queryParams.append("endDate", params.endDate)
    if (params.status) params.status.forEach((s) => queryParams.append("status", s))

    return this.request<PaginatedResponse<Invoice>>(`/bookings?${queryParams}`)
  }

  /**
   * Tạo booking mới
   * POST /bookings
   * Body: CreateBookingRequest
   */
  async createBooking(data: CreateBookingRequest): Promise<ApiResponse<Invoice>> {
    return this.request<Invoice>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  /**
   * Cập nhật trạng thái booking
   * PATCH /bookings/{bookingId}/status
   * Body: { status: string }
   */
  async updateBookingStatus(bookingId: number, status: string): Promise<ApiResponse<Invoice>> {
    return this.request<Invoice>(`/bookings/${bookingId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  /**
   * Cập nhật trạng thái thanh toán
   * PATCH /bookings/{bookingId}/payment-status
   * Body: { paymentStatus: string }
   */
  async updatePaymentStatus(bookingId: number, paymentStatus: string): Promise<ApiResponse<Invoice>> {
    return this.request<Invoice>(`/bookings/${bookingId}/payment-status`, {
      method: "PATCH",
      body: JSON.stringify({ paymentStatus }),
    })
  }

  /**
   * Xóa/hủy booking
   * DELETE /bookings/{bookingId}
   */
  async cancelBooking(bookingId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/bookings/${bookingId}`, {
      method: "DELETE",
    })
  }

  /**
   * Kiểm tra tình trạng API server
   * GET /health
   */
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request<{ status: string; timestamp: string }>("/health")
  }
}

export const apiClient = new ApiClient()
