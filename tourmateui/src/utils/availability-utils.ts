import { TourGuideSchedule } from "@/types/invoice"

// Kiểm tra xem tour guide có available không tại thời điểm cụ thể
export const isTourGuideAvailable = (
  tourGuideId: number,
  date: Date,
  timeSlot: string,
  duration: string, // Format: "08:00:00"
  allSchedules: TourGuideSchedule[],
  includePending = true, // Thêm option để include pending bookings
): boolean => {
  const [startHour] = timeSlot.split(":").map(Number)
  const [durationHours] = duration.split(":").map(Number)
  const endHour = startHour + durationHours

  // Lấy tất cả booking của tour guide trong ngày
  const daySchedules = allSchedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.startDate)
    const validStatuses = includePending ? ["confirmed", "pending"] : ["confirmed"]

    return (
      schedule.tourGuideId === tourGuideId &&
      scheduleDate.toDateString() === date.toDateString() &&
      validStatuses.includes(schedule.status)
    )
  })

  // Kiểm tra xem có conflict không
  return !daySchedules.some((schedule) => {
    const scheduleStartHour = new Date(schedule.startDate).getHours()
    const scheduleEndHour = new Date(schedule.endDate).getHours()

    // Kiểm tra overlap: (start1 < end2) && (start2 < end1)
    return startHour < scheduleEndHour && scheduleStartHour < endHour
  })
}

// Lấy danh sách các booking conflict để hiển thị thông tin
export const getConflictingBookings = (
  tourGuideId: number,
  date: Date,
  timeSlot: string,
  duration: string,
  allSchedules: TourGuideSchedule[],
  bufferHour: number = 1 // default = 1h buffer
): TourGuideSchedule[] => {
  const [startHour, startMinute] = timeSlot.split(":").map(Number)
  const [durationHours] = duration.split(":").map(Number)
  const slotStart = new Date(date)
  slotStart.setHours(startHour, startMinute, 0, 0)
  const slotEnd = new Date(slotStart)
  slotEnd.setHours(slotEnd.getHours() + durationHours)

  return allSchedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.startDate)
    if (
      schedule.tourGuideId !== tourGuideId ||
      scheduleDate.toDateString() !== date.toDateString() ||
      !["confirmed", "pending"].includes(schedule.status)
    ) {
      return false
    }

    const scheduleStart = new Date(schedule.startDate)
    const scheduleEnd = new Date(schedule.endDate)
    scheduleEnd.setHours(scheduleEnd.getHours() + bufferHour)

    // Disable slot nếu slotStart nằm trong khoảng [scheduleStart, scheduleEnd)
    return slotStart >= scheduleStart && slotStart < scheduleEnd
  })
}


// Lấy tất cả ngày có booking của tour guide
export const getTourGuideBusyDates = (tourGuideId: number, allSchedules: TourGuideSchedule[]): Date[] => {
  const busyDates = allSchedules
    .filter((schedule) => schedule.tourGuideId === tourGuideId && ["confirmed", "pending"].includes(schedule.status))
    .map((schedule) => new Date(schedule.startDate))

  // Remove duplicates
  const uniqueDates = busyDates.filter(
    (date, index, self) => index === self.findIndex((d) => d.toDateString() === date.toDateString()),
  )

  return uniqueDates
}

// Thêm function để format ngày giờ cho display
export const formatScheduleTime = (startDate: string, endDate: string): string => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")} - ${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`
}

// Function để check xem có phải ngày hôm nay không
export const isToday = (date: Date): boolean => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// Function để check xem có phải tương lai không
export const isFutureDate = (date: Date): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date >= today
}
