"use client"

import { useState, useEffect } from "react"
import { BookingFormData, Invoice, TourServiceBooking } from "@/types/invoice"
import { useMonthlySchedule } from "../hooks/use-monthly-schedule"
import { HeroSection } from "./tour/hero-section"
import { TourGuideCard } from "./tour/tour-guide-card"
import { BookedToursList } from "./tour/booked-tours-list"
import { CalendarComponent } from "./tour/calendar-component"
import { TimeSlots } from "./tour/time-slots"
import { BookingDialog } from "./tour/booking-dialog"
import { TourScheduleService } from "@/services/tour-service"

export default function TourBookingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [bookedSlots, setBookedSlots] = useState<Invoice[]>([])
  const [tourService, setTourService] = useState<TourServiceBooking | null>(null)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [formData, setFormData] = useState<BookingFormData>({
    selectedPeople: "2",
    bookingType: "pay-now" as "pay-now" | "hold-slot",
    note: "",
  })
  const [isLoadingData, setIsLoadingData] = useState(true)

  const { loadMonthSchedule, getSchedulesForMonth, isLoadingMonth } = useMonthlySchedule(
    tourService?.tourGuideId || 201,
  )

  /**
   * Load dữ liệu ban đầu khi component mount
   * 1. Gọi API lấy thông tin tour service
   * 2. Gọi API lấy danh sách booking của service này
   * 3. Gọi API lấy lịch trình tháng hiện tại
   */
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingData(true)

      try {
        const service = await TourScheduleService.getTourService(1)
        setTourService(service)

        const bookings = await TourScheduleService.getBookings(1, service.tourGuideId)
        setBookedSlots(bookings)

        await loadMonthSchedule(currentMonth)
      } catch (error) {
        console.error("Failed to load initial data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadInitialData()
  }, [currentMonth, loadMonthSchedule])

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1)
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1)
      }
      return newMonth
    })
  }

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)
    setIsBookingDialogOpen(true)
  }

  const handleFormDataChange = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  /**
   * Xử lý xác nhận booking
   * Gọi API tạo booking mới và cập nhật state
   */
  const handleConfirmBooking = async () => {
    if (!tourService) return

    try {
      const bookingData = {
        serviceId: tourService.serviceId,
        tourGuideId: tourService.tourGuideId,
        customerId: 999,
        startDate: `${selectedDate.toISOString().split("T")[0]}T${selectedTimeSlot}:00`,
        endDate: `${selectedDate.toISOString().split("T")[0]}T${(Number.parseInt(selectedTimeSlot.split(":")[0]) + Number.parseInt(tourService.duration.split(":")[0])).toString().padStart(2, "0")}:00:00`,
        peopleAmount: formData.selectedPeople,
        note: formData.note,
        bookingType: formData.bookingType as "pay-now" | "hold-slot",
      }

      const newBooking = await TourScheduleService.createBooking(bookingData)
      setBookedSlots((prev) => [...prev, newBooking])
      await loadMonthSchedule(currentMonth)

      setIsBookingDialogOpen(false)
    } catch (error) {
      console.error("Failed to create booking:", error)
    }
  }

  const currentMonthSchedules = getSchedulesForMonth(currentMonth)
  const isLoading = isLoadingMonth(currentMonth) || isLoadingData

  if (isLoadingData || !tourService) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <HeroSection tourService={tourService} />

      <div className="max-w-7xl mx-auto p-6 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <TourGuideCard tourService={tourService} />
            <BookedToursList bookedSlots={bookedSlots} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <CalendarComponent
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              bookedSlots={bookedSlots}
              tourGuideSchedule={currentMonthSchedules}
              tourGuideId={tourService.tourGuideId}
              currentServiceId={tourService.serviceId}
              isLoading={isLoading}
              onDateSelect={setSelectedDate}
              onMonthNavigate={navigateMonth}
            />
            <TimeSlots
              selectedDate={selectedDate}
              bookedSlots={bookedSlots}
              tourGuideSchedule={currentMonthSchedules}
              tourService={tourService}
              onTimeSlotSelect={handleTimeSlotSelect}
            />
          </div>
        </div>
      </div>

      <BookingDialog
        isOpen={isBookingDialogOpen}
        onClose={() => setIsBookingDialogOpen(false)}
        tourService={tourService}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onConfirmBooking={handleConfirmBooking}
      />
    </div>
  )
}
