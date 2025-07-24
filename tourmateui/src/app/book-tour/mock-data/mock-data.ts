
/**
 * MOCK DATA - CHỈ ĐỂ THAM KHẢO CẤU TRÚC
 * Dữ liệu này chỉ để dev tham khảo format của API response
 * Không được sử dụng trong production code
 */

import { Invoice, TourServiceBooking } from "@/types/invoice"

const today = new Date()
const getDateString = (daysOffset: number) => {
  const date = new Date(today)
  date.setDate(today.getDate() + daysOffset)
  return date.toISOString().split("T")[0]
}

// Cấu trúc Invoice từ API /bookings
export const mockInvoices: Invoice[] = [
  {
    invoiceId: 1,
    startDate: `${getDateString(0)}T09:00:00`,
    endDate: `${getDateString(0)}T17:00:00`,
    peopleAmount: "4",
    status: "confirmed",
    paymentStatus: "paid",
    price: 1400000,
    note: "Tour tham quan phố cổ Hà Nội",
    createdDate: `${getDateString(-1)}T10:00:00`,
    customerId: 101,
    tourGuideId: 201,
    serviceId: 1,
    serviceName: "Khám Phá Phố Cổ Hà Nội",
  },
]

// Cấu trúc TourService từ API /tour-services/{id}
export const mockTourService: TourServiceBooking = {
  serviceId: 1,
  serviceName: "Khám Phá Phố Cổ Hà Nội",
  price: 350000,
  duration: "08:00:00",
  content: "Trải nghiệm văn hóa độc đáo của phố cổ Hà Nội",
  image: "/placeholder.svg?height=400&width=600&text=Phố Cổ Hà Nội",
  tourGuideId: 201,
  createdDate: "2024-01-01",
  isDeleted: false,
  title: "Hành Trình Khám Phá Văn Hóa Phố Cổ",
  tourDesc: "Khám phá 36 phố phường, thưởng thức ẩm thực truyền thống",
  areaName: "Quận Hoàn Kiếm, Hà Nội",
  tourGuideName: "Nguyễn Văn An",
  tourGuideAvatar: "/placeholder.svg?height=60&width=60&text=Guide",
  rating: 4.9,
  reviewCount: 127,
  availableTimeSlots: ["07:00", "08:00", "09:00", "10:00", "13:00", "14:00", "15:00", "16:00"],
  workingHours: {
    start: "07:00",
    end: "18:00",
  },
}
