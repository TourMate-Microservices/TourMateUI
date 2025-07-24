// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// API Request types
export interface GetMonthlyScheduleParams {
  tourGuideId: number
  year: number
  month: number
}

export interface GetTourServiceParams {
  serviceId: number
}

export interface GetBookingsParams {
  serviceId: number
  tourGuideId: number
  startDate?: string
  endDate?: string
  status?: string[]
}

export interface CreateBookingRequest {
  serviceId: number
  tourGuideId: number
  customerId: number
  startDate: string
  endDate: string
  peopleAmount: string
  note: string
  bookingType: "pay-now" | "hold-slot"
}
