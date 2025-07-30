"use client"

import { Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Invoice, TourGuideSchedule, TourServiceBooking } from "@/types/invoice"
import { generateTimeSlots } from "@/utils/date-utils"
import { isTourGuideAvailable, getConflictingBookings, formatScheduleTime, isToday } from "@/utils/availability-utils"

interface TimeSlotsProps {
  selectedDate: Date
  bookedSlots: Invoice[]
  tourGuideSchedule: TourGuideSchedule[]
  tourService: TourServiceBooking // Thay đổi để nhận full tour service
  onTimeSlotSelect: (timeSlot: string) => void
}

export function TimeSlots({
  selectedDate,
  tourGuideSchedule,
  tourService,
  onTimeSlotSelect,
}: TimeSlotsProps) {
  // Sử dụng time slots từ tour service
  const timeSlots = generateTimeSlots(tourService)

  // Thêm check nếu không có timeSlots
  if (timeSlots.length === 0) {
    return (
      <Card className="py-5 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-600" />
            Khung Giờ Có Sẵn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium mb-2">Không có khung giờ nào</h3>
            <p className="text-sm">Tour này hiện tại không có khung giờ hoạt động</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isTimeSlotAvailable = (date: Date, timeSlot: string) => {
    return isTourGuideAvailable(tourService.tourGuideId, date, timeSlot, tourService.duration, tourGuideSchedule)
  }

  const getConflictInfo = (date: Date, timeSlot: string) => {
    return getConflictingBookings(tourService.tourGuideId, date, timeSlot, tourService.duration, tourGuideSchedule)
  }

  const isPastTime = (timeSlot: string) => {
    if (!isToday(selectedDate)) return false
    const currentHour = new Date().getHours()
    const slotHour = Number.parseInt(timeSlot.split(":")[0])
    let isPast = slotHour <= currentHour

    // Disable cả slot bắt đầu và slot kết thúc của booking
    const conflictingBookings = getConflictingBookings(tourService.tourGuideId, selectedDate, timeSlot, tourService.duration, tourGuideSchedule)
    if (conflictingBookings.some(b => {
      const bookingStart = new Date(b.startDate)
      const bookingEnd = new Date(b.endDate)
      return slotHour >= bookingStart.getHours() && slotHour <= bookingEnd.getHours();
    }) || conflictingBookings.some(b => {
      const bookingStart = new Date(b.startDate)
      const bookingEnd = new Date(b.endDate)
      return slotHour === bookingStart.getHours() || slotHour === bookingEnd.getHours();
    })) {
      isPast = true
    }
    return isPast
  }

  return (
    <Card className="py-5 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Clock className="w-6 h-6 mr-2 text-blue-600" />
          Khung Giờ Có Sẵn -{" "}
          {selectedDate.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" })}
        </CardTitle>
        {isToday(selectedDate) && (
          <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span>Hôm nay - Giờ hiện tại: {new Date().getHours()}:00</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {timeSlots.map((timeSlot) => {
            const isAvailable = isTimeSlotAvailable(selectedDate, timeSlot)
            const conflictingBookings = getConflictInfo(selectedDate, timeSlot)
            const isPast = isPastTime(timeSlot)

            return (
              <div key={timeSlot} className="relative group">
                <Button
                  variant={isAvailable && !isPast ? "outline" : "secondary"}
                  disabled={!isAvailable || isPast}
                  className={`
                    w-full h-20 text-base font-medium transition-all duration-200 flex flex-col items-center justify-center
                    ${
                      isAvailable && !isPast
                        ? "hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-300 hover:text-green-700 hover:scale-105 hover:shadow-md"
                        : ""
                    }
                    ${!isAvailable && !isPast ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border-red-200 cursor-not-allowed" : ""}
                    ${isPast ? "opacity-40 cursor-not-allowed bg-gray-100" : ""}
                  `}
                  onClick={() => {
                    if (isAvailable && !isPast) {
                      onTimeSlotSelect(timeSlot)
                    }
                  }}
                >
                  <Clock className="w-4 h-4 mb-1" />
                  <span>{timeSlot}</span>
                  {isPast && <span className="text-xs">Đã qua</span>}
                </Button>

                {/* Tooltip chỉ hiển thị khi hover time slot bị conflict */}
                {!isAvailable && !isPast && conflictingBookings.length > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 min-w-[200px]">
                    <div className="font-medium mb-2 text-center">Hướng dẫn viên đã có lịch:</div>
                    {conflictingBookings.map((booking, index) => (
                      <div key={index} className="mb-1 p-1 bg-white/10 rounded">
                        <div className="font-medium text-yellow-300">{booking.serviceName}</div>
                        <div className="text-xs">{formatScheduleTime(booking.startDate, booking.endDate)}</div>
                        {booking.status === "pending" && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Chờ xác nhận
                          </Badge>
                        )}
                      </div>
                    ))}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded"></div>
              <span>Có sẵn</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-100 to-pink-100 border border-red-300 rounded"></div>
              <span>Hướng dẫn viên bận</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded opacity-50"></div>
              <span>Đã qua</span>
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
            <div className="font-medium mb-1">💡 Thông tin tour:</div>
            <ul className="space-y-1">
              <li>• Thời lượng: {tourService.duration.split(":")[0]} giờ</li>
              <li>• Khung giờ có sẵn: {timeSlots.join(", ")}</li>
              <li>• Hover vào khung giờ đỏ để xem chi tiết tour bị trùng</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
