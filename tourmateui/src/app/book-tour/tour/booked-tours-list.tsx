import { Calendar, Users, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Invoice } from "@/types/invoice"
import { formatCurrency } from "@/utils/date-utils"

interface BookedToursListProps {
  bookedSlots: Invoice[]
}

export function BookedToursList({ bookedSlots }: BookedToursListProps) {
  // Sắp xếp theo ngày gần nhất
  const sortedBookings = [...bookedSlots].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  )

  return (
    <Card className="py-5 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Lịch Sử Đặt Tour
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {bookedSlots.length} tour
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {sortedBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">Chưa có tour nào</h3>
              <p className="text-sm">Hãy chọn ngày và đặt tour đầu tiên của bạn!</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 text-xs">
                💡 Mẹo: Chọn ngày trên lịch để xem các khung giờ có sẵn
              </div>
            </div>
          ) : (
            sortedBookings.map((booking) => {
              const startDate = new Date(booking.startDate)
              const endDate = new Date(booking.endDate)
              const isUpcoming = startDate > new Date()
              const isToday = startDate.toDateString() === new Date().toDateString()

              return (
                <div
                  key={booking.invoiceId}
                  className={`p-4 border rounded-xl transition-all duration-200 hover:shadow-md ${
                    isToday
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                      : isUpcoming
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                        : "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "secondary"}
                        className={`${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                      </Badge>
                      {isToday && <Badge className="bg-blue-500 text-white animate-pulse">Hôm nay</Badge>}
                    </div>
                    <Badge
                      variant={booking.paymentStatus === "paid" ? "default" : "destructive"}
                      className={booking.paymentStatus === "paid" ? "bg-green-500" : ""}
                    >
                      {booking.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        {startDate.toLocaleDateString("vi-VN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {startDate.getHours().toString().padStart(2, "0")}:
                        {startDate.getMinutes().toString().padStart(2, "0")} -
                        {endDate.getHours().toString().padStart(2, "0")}:
                        {endDate.getMinutes().toString().padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{booking.peopleAmount} người</span>
                    </div>

                    {booking.note && (
                      <div className="text-sm text-gray-600 bg-white/50 p-2 rounded italic">&quot;{booking.note}&quot;</div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-sm text-gray-500">Tổng tiền:</span>
                      <span className="font-bold text-green-600 text-lg">{formatCurrency(booking.price)}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Summary */}
        {bookedSlots.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tổng doanh thu:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(bookedSlots.reduce((sum, booking) => sum + booking.price, 0))}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
