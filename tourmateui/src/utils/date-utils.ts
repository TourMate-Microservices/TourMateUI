import { TourServiceBooking } from "@/types/invoice"

export const generateCalendarDays = (currentMonth: Date) => {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const current = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return days
}

// Tạo time slots dựa trên tour service settings
export const generateTimeSlots = (tourService: TourServiceBooking) => {
  const { availableTimeSlots, workingHours } = tourService

  // Nếu có custom time slots, sử dụng chúng
  if (availableTimeSlots && availableTimeSlots.length > 0) {
    return availableTimeSlots
  }

  // Nếu không, tạo slots từ working hours
  const startHour = Number.parseInt(workingHours.start.split(":")[0])
  const endHour = Number.parseInt(workingHours.end.split(":")[0])
  const slots = []

  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
  }

  return slots
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatDuration = (duration: string) => {
  const [hours, minutes] = duration.split(":")
  return `${hours}h${minutes !== "00" ? minutes + "m" : ""}`
}

// Utility để tạo month key cho caching
export const getMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
}

// Kiểm tra xem date có trong tháng hiện tại không
export const isInCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()
}
