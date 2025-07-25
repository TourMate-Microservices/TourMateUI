export interface Invoice {
  invoiceId: number
  startDate: string
  endDate: string
  peopleAmount: string
  status: string
  paymentStatus: string
  price: number
  note: string
  createdDate: string
  customerId: number
  tourGuideId: number
  serviceId: number
  serviceName?: string
}

export interface TourServiceBooking {
  serviceId: number
  serviceName: string
  price: number
  duration: string
  content: string
  image: string
  tourGuideId: number
  createdDate: string
  isDeleted: boolean
  title: string
  tourDesc: string
  areaName: string
  tourGuideName: string
  tourGuideAvatar: string
  rating: number
  reviewCount: number
  availableTimeSlots: string[] // Thêm khung giờ có sẵn cho tour này
  workingHours: {
    start: string // "07:00"
    end: string // "20:00"
  }
}

export interface BookingFormData {
  selectedPeople: string
  bookingType: string
  note: string
}

export interface TourGuideSchedule {
  tourGuideId: number
  startDate: string
  endDate: string
  serviceId: number
  serviceName: string
  status: string
}

// Interface cho API request
export interface MonthlyScheduleRequest {
  tourGuideId: number
  year: number
  month: number // 1-12
}

export interface MonthlyScheduleResponse {
  schedules: TourGuideSchedule[]
  totalCount: number
}

export interface MonthlyInvoiceStatistics {
  totalInvoices: number
  totalRevenue: number
  completedInvoices: number
  pendingInvoices: number
  cancelledInvoices: number
  averageBookingValue: number
}
