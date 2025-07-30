'use client'

import { useState, useEffect } from "react"
import TourGuideSidebar from "./sidebar"
import ScheduleCard from "./schedule-card"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
// import { TourSchedule } from "@/types/tour-schedule"
import MegaMenu from "@/components/mega-menu"
import Footer from "@/components/footer"
import { searchInvoicesByTourGuideStatusPaged } from "@/api/invoice.api"
import { getTourGuideByAccountId } from "@/api/tour-guide.api"
import type { InvoiceSearchPaged } from "@/types/invoice"
import { useToken } from "@/components/getToken"
import { jwtDecode } from "jwt-decode"
import { MyJwtPayload } from "@/types/jwt-payload"


const pageSize = 5

export default function TourSchedulePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("pending")
  const [currentPage, setCurrentPage] = useState(1)
  const [tourGuideId, setTourGuideId] = useState<number | null>(null)

  const token = useToken("accessToken")
  const payLoad: MyJwtPayload | undefined = token ? jwtDecode<MyJwtPayload>(token) : undefined
  const accountId = Number(payLoad?.AccountId)
  const role = payLoad?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]

  // Lấy tourGuideId từ accountId
  useEffect(() => {
    if (accountId) {
      getTourGuideByAccountId(accountId)
        .then(tourGuideData => {
          setTourGuideId(tourGuideData.tourGuideId)
        })
        .catch(error => {
          console.error("Failed to get tour guide:", error)
        })
    }
  }, [accountId])

  const { data, isLoading, isError } = useQuery<InvoiceSearchPaged>({
    queryKey: ["tour-schedules", tourGuideId, selectedStatus, currentPage, searchTerm],
    queryFn: () =>
      searchInvoicesByTourGuideStatusPaged({
        tourGuideId: tourGuideId!,
        status: selectedStatus,
        page: currentPage,
        size: pageSize,
        // Có thể bổ sung filter/searchTerm nếu backend hỗ trợ
      }),
    enabled: !!tourGuideId, // Chỉ gọi API khi đã có tourGuideId
    retry: 1,
    refetchOnWindowFocus: false,
  })



  const schedules = data?.data ?? []
  const totalPages = data?.total_pages ?? 1

  const handleFilterChange = (statusCode: string) => {
    setSelectedStatus(statusCode)
    setSearchTerm("")
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }
  return (
    <>
      <MegaMenu />
      <div className="flex flex-col md:flex-row text-gray-900 bg-gray-50">
        
        {/* Sidebar desktop */}
        <div className="hidden md:flex p-4 md:p-10 flex-col sticky top-20 h-fit self-start">
          <TourGuideSidebar onNavItemClick={handleFilterChange} />
        </div>
        {/* Sidebar mobile */}
        <div className="md:hidden p-2">
          <TourGuideSidebar onNavItemClick={handleFilterChange} />
        </div>
        <main className="flex-1 md:py-10 md:pr-10 space-y-6">
          {/* Search box */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên khách hoặc mã tour"
              className="flex-grow text-gray-900 text-base font-normal bg-transparent border-none outline-none placeholder:text-gray-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Lịch hẹn */}
          {isLoading && <p>Đang tải dữ liệu...</p>}
          {isError && <p className="text-red-500">Lỗi khi tải dữ liệu.</p>}
          {schedules.map((schedule) => (
            <ScheduleCard customerName={""} customerPhone={""} tourGuideName={""} tourGuidePhone={""} email={""} tourName={""} tourDesc={""} areaName={""} paymentMethod={""} tourGuideAccountId={0} customerAccountId={0} key={schedule.invoiceId} {...schedule} />
          ))}
          {!isLoading && schedules.length === 0 && (
            <p className="text-gray-500">Không tìm thấy lịch hẹn nào phù hợp.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="text-sm px-3 py-1 rounded border bg-white disabled:opacity-50"
              >
                <ChevronLeft className="inline w-4 h-4" /> Trước
              </button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="text-sm px-3 py-1 rounded border bg-white disabled:opacity-50"
              >
                Tiếp <ChevronRight className="inline w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}