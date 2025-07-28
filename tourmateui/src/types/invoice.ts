// Phân trang kết quả search invoice theo tour guide
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
}
import { TourService } from "./tour-service"
import { Feedback } from "./feedbacks"
import { PagedResult } from "./response"

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
  service: TourService
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
  },
  feedbacks?: PagedResult<Feedback>
}

export interface BookingFormData {
  selectedPeople: string
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

export interface InvoiceSchedule {
  invoiceId: number;
  serviceId: number;
  customerName: string;
  customerPhone: string;
  tourGuideName: string;
  tourGuidePhone: string;
  email: string;
  tourName: string;
  tourDesc: string;
  areaName: string;
  startDate: string; // hoặc Date, tùy cách bạn parse ở client
  endDate: string;   // tương tự
  peopleAmount: string;
  price: number;
  paymentMethod: string;
  status: string;
  note: string;
  createdDate: string; // hoặc Date
  tourGuideId: number;
  customerId: number;
}

export interface InvoiceSearchPaged {

}
