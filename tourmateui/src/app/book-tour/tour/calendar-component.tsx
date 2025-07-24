"use client"

import { ChevronLeft, ChevronRight, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateCalendarDays, isInCurrentMonth } from "@/utils/date-utils"
import { Invoice, TourGuideSchedule } from "@/types/invoice"

interface CalendarComponentProps {
  currentMonth: Date
  selectedDate: Date
  bookedSlots: Invoice[]
  tourGuideSchedule: TourGuideSchedule[]
  tourGuideId: number
  currentServiceId: number // Thêm prop để biết service hiện tại
  isLoading: boolean
  onDateSelect: (date: Date) => void
  onMonthNavigate: (direction: "prev" | "next") => void
}

export function CalendarComponent({
  currentMonth,
  selectedDate,
  bookedSlots,
  tourGuideSchedule,
  tourGuideId,
  currentServiceId,
  isLoading,
  onDateSelect,
  onMonthNavigate,
}: CalendarComponentProps) {
  const calendarDays = generateCalendarDays(currentMonth)

  const getBookingsForDate = (date: Date) => {
    return bookedSlots.filter((booking) => {
      const bookingDate = new Date(booking.startDate)
      return bookingDate.toDateString() === date.toDateString()
    })
  }

  const getSchedulesForDate = (date: Date) => {
    return tourGuideSchedule.filter((schedule) => {
      const scheduleDate = new Date(schedule.startDate)
      return scheduleDate.toDateString() === date.toDateString()
    })
  }

  // Kiểm tra có booking từ service hiện tại không
  const hasCurrentServiceBookings = (date: Date) => {
    const currentServiceBookings = getBookingsForDate(date)
    const currentServiceSchedules = getSchedulesForDate(date).filter(
      (schedule) => schedule.serviceId === currentServiceId,
    )
    return currentServiceBookings.length > 0 || currentServiceSchedules.length > 0
  }

  // Kiểm tra có booking từ service khác không
  const hasOtherServiceBookings = (date: Date) => {
    const otherServiceSchedules = getSchedulesForDate(date).filter(
      (schedule) => schedule.serviceId !== currentServiceId,
    )
    return otherServiceSchedules.length > 0
  }

  return (
    <Card className="py-5 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Chọn Ngày
            {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin text-blue-600" />}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMonthNavigate("prev")}
              className="hover:bg-blue-50"
              disabled={isLoading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-semibold min-w-[140px] text-center text-lg">
              {currentMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMonthNavigate("next")}
              className="hover:bg-blue-50"
              disabled={isLoading}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 p-3">
              {day}
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-7 gap-2 animate-pulse">
            {Array.from({ length: 42 }).map((_, index) => (
              <div key={index} className="h-12 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const isCurrentMonthDay = isInCurrentMonth(day, currentMonth)
              const isToday = day.toDateString() === new Date().toDateString()
              const isSelected = day.toDateString() === selectedDate.toDateString()
              const hasCurrentBookings = hasCurrentServiceBookings(day)
              const hasOtherBookings = hasOtherServiceBookings(day)
              const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))

              return (
                <button
                  key={index}
                  onClick={() => !isPast && isCurrentMonthDay && onDateSelect(day)}
                  disabled={isPast || !isCurrentMonthDay}
                  className={`
                    w-full p-3 text-sm rounded-xl transition-all duration-200 relative font-medium min-h-[48px]
                    ${!isCurrentMonthDay ? "text-gray-300 cursor-default" : ""}
                    ${isToday && isCurrentMonthDay ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 ring-2 ring-blue-200" : ""}
                    ${isSelected ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105" : ""}
                    ${hasCurrentBookings && !isSelected && isCurrentMonthDay ? "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-2 border-orange-300" : ""}
                    ${hasOtherBookings && !isSelected && !hasCurrentBookings && isCurrentMonthDay ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-2 border-purple-300" : ""}
                    ${isPast ? "opacity-40 cursor-not-allowed" : ""}
                    ${!isPast && !isSelected && !isToday && isCurrentMonthDay && !hasCurrentBookings && !hasOtherBookings ? "hover:bg-gray-100 hover:scale-105 hover:shadow-md" : ""}
                  `}
                >
                  {day.getDate()}

                  {/* Indicator cho booking service hiện tại - màu cam */}
                  {hasCurrentBookings && isCurrentMonthDay && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-sm"></div>
                  )}

                  {/* Indicator cho booking service khác - màu tím */}
                  {hasOtherBookings && !hasCurrentBookings && isCurrentMonthDay && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-purple-500 rounded-full shadow-sm"></div>
                  )}

                  {/* Indicator khi có cả 2 loại booking */}
                  {hasCurrentBookings && hasOtherBookings && isCurrentMonthDay && (
                    <div className="absolute top-1 right-1 flex space-x-0.5">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-300 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <span className="font-medium">Tour này có booking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <span className="font-medium">HDV bận (tour khác)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
