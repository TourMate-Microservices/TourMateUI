"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMonthlySchedule } from "./../../hooks/use-monthly-schedule"
import { TourScheduleService } from "@/services/tour-service"
import { Button } from "@/components/ui/button"
import { BookingFormData, Invoice, TourServiceBooking } from "@/types/invoice"
import { HeroSection } from "../tour/hero-section"
import { TourGuideCard } from "../tour/tour-guide-card"
import { BookedToursList } from "../tour/booked-tours-list"
import { CalendarComponent } from "../tour/calendar-component"
import { TimeSlots } from "../tour/time-slots"
import { BookingDialog } from "../tour/booking-dialog"
import Footer from "@/components/footer"
import MegaMenu from "@/components/mega-menu"
import { MyJwtPayload } from "@/types/jwt-payload"
import { useToken } from "@/utils/get-token"
import { jwtDecode } from "jwt-decode"
import { getCustomer } from "@/api/customer.api"

export default function TourBookingCalendar() {
  const params = useParams()
  const router = useRouter()
  const serviceId = Number(params.serviceId)
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [bookedSlots, setBookedSlots] = useState<Invoice[]>([])
  const [tourService, setTourService] = useState<TourServiceBooking | null>(null)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [formData, setFormData] = useState<BookingFormData>({
    selectedPeople: "1",
    note: "",
  })
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false)

  const { loadMonthSchedule, getSchedulesForMonth, isLoadingMonth } = useMonthlySchedule(
    tourService?.tourGuideId || 0,
  )

  const token = useToken("accessToken")
    const decoded: MyJwtPayload | null = token ? jwtDecode<MyJwtPayload>(token.toString()) : null
    const accountId = decoded?.AccountId

  useEffect(() => {
    if (accountId) {
      setIsLoadingCustomer(true)
      const result = getCustomer(accountId)
      result.then(customer => {
        if (customer) {
          setCustomerId(customer.customerId)
        } else {
          console.error("Không tìm thấy thông tin khách hàng")
        }
      }).catch(error => {
        console.error("Lỗi khi tải thông tin khách hàng:", error)
      }).finally(() => {
        setIsLoadingCustomer(false)
      })
    }
  }, [accountId])

  /**
   * Load dữ liệu ban đầu khi component mount
   * 1. Gọi API lấy thông tin tour service theo serviceId từ params
   * 2. Gọi API lấy danh sách booking của service này
   * 3. Gọi API lấy lịch trình tháng hiện tại
   */
  useEffect(() => {
    if (!serviceId || isNaN(serviceId)) {
      setError("ID tour không hợp lệ")
      setIsLoadingData(false)
      return
    }

    const loadInitialData = async () => {
      setIsLoadingData(true)
      setError(null)

      try {
        const service = await TourScheduleService.getTourService(serviceId)
        setTourService(service)

        // Tính toán start và end date của tháng hiện tại
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
        
        const startDate = startOfMonth.toISOString().split('T')[0]
        const endDate = endOfMonth.toISOString().split('T')[0]

        const invoices = await TourScheduleService.getInvoices(serviceId, service.tourGuideId, startDate, endDate)
        setBookedSlots(invoices)

        await loadMonthSchedule(currentMonth)
      } catch (error) {
        console.error("Failed to load initial data:", error)
        setError("Không thể tải dữ liệu tour. Vui lòng thử lại sau.")

        // Set empty data để UI vẫn hiển thị được
        setTourService({
          serviceId: serviceId,
          serviceName: "Tour không xác định",
          price: 0,
          duration: "08:00:00",
          content: "",
          image: "/placeholder.svg?height=400&width=600&text=Tour",
          tourGuideId: 0,
          createdDate: "",
          isDeleted: false,
          title: "Không thể tải thông tin tour",
          tourDesc: "Vui lòng thử lại sau",
          areaName: "",
          tourGuideName: "Hướng dẫn viên",
          tourGuideAvatar: "/placeholder.svg?height=60&width=60&text=Guide",
          rating: 0,
          reviewCount: 0,
          availableTimeSlots: [],
          workingHours: { start: "07:00", end: "18:00" },
        })
        setBookedSlots([])
      } finally {
        setIsLoadingData(false)
      }
    }

    loadInitialData()
  }, [serviceId, currentMonth, loadMonthSchedule])

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
   * Gọi API tạo booking mới và redirect đến trang payment
   */
  const handleConfirmBooking = async () => {
    if (!tourService) return

    // Kiểm tra xem customerId đã được load chưa
    if (!customerId) {
      console.error("Customer ID chưa được tải. Vui lòng thử lại.")
      // Có thể thêm toast notification ở đây
      return
    }

    try {
      const bookingData = {
        invoiceId: 0, // Chưa có ID khi tạo mới
        startDate: `${selectedDate.toISOString().split("T")[0]}T${selectedTimeSlot}:00`,
        endDate: `${selectedDate.toISOString().split("T")[0]}T${(Number.parseInt(selectedTimeSlot.split(":")[0]) + Number.parseInt(tourService.duration.split(":")[0])).toString().padStart(2, "0")}:00:00`,
        peopleAmount: formData.selectedPeople,
        status: "pending",
        paymentStatus: "unpaid",
        price: tourService.price * Number.parseInt(formData.selectedPeople),
        note: formData.note,
        createdDate: new Date().toISOString(),
        tourGuideId: tourService.tourGuideId,
        customerId: customerId,
        serviceId: tourService.serviceId
    }
      
      console.log("Booking data:", bookingData)
      // const newInvoice = await TourScheduleService.createInvoice(bookingData)
      
      // // Redirect đến trang payment với invoice ID
      // router.push(`/payment/tour/${newInvoice.invoiceId}`)
      
    } catch (error) {
      console.error("Failed to create invoice:", error)
      // Có thể thêm toast notification ở đây để thông báo lỗi
    }
  }

  const currentMonthSchedules = getSchedulesForMonth(currentMonth)
  const isLoading = isLoadingMonth(currentMonth) || isLoadingData

  // Loading skeleton thay vì loading screen
  if (isLoadingData) {
    return (
      <>
      <MegaMenu />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Skeleton */}
        <div className="relative h-96 bg-gray-200 animate-pulse">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto p-10 -mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      </>
    )
  }

  // Error state với retry button
  if (error && !tourService) {
    return (
      <> 
      <MegaMenu />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không thể tải dữ liệu</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600">
            Thử lại
          </Button>
        </div>
      </div>
      <Footer /> </>
    )
  }

  return (
    <>
    <MegaMenu/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {tourService && <HeroSection tourService={tourService} />}

      <div className="mx-auto p-10 -mt-20 relative z-10">
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-sm text-yellow-800">{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
            >
              Thử lại
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {tourService && <TourGuideCard tourService={tourService} />}
            <BookedToursList bookedSlots={bookedSlots} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <CalendarComponent
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              bookedSlots={bookedSlots}
              tourGuideSchedule={currentMonthSchedules}
              tourGuideId={tourService?.tourGuideId ?? 0}
              currentServiceId={tourService?.serviceId ?? 0}
              isLoading={isLoading}
              onDateSelect={setSelectedDate}
              onMonthNavigate={navigateMonth}
            />
            {tourService && (
              <TimeSlots
                selectedDate={selectedDate}
                bookedSlots={bookedSlots}
                tourGuideSchedule={currentMonthSchedules}
                tourService={tourService}
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            )}
          </div>
        </div>
      </div>

      {tourService && (
        <BookingDialog
          isOpen={isBookingDialogOpen}
          onClose={() => setIsBookingDialogOpen(false)}
          tourService={tourService}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onConfirmBooking={handleConfirmBooking}
          isLoadingCustomer={isLoadingCustomer}
        />
      )}
    </div>
    <Footer />
    </>
  )
}
