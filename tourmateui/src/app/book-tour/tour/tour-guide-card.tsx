import { Star } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/utils/date-utils"
import { TourServiceBooking } from "@/types/invoice"

interface TourGuideCardProps {
  tourService: TourServiceBooking
}

export function TourGuideCard({ tourService }: TourGuideCardProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={tourService.tourGuideAvatar || "/placeholder.svg"}
              alt={tourService.tourGuideName}
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{tourService.tourGuideName}</h3>
            <p className="text-sm text-gray-600">Hướng dẫn viên địa phương</p>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{tourService.rating}</span>
              <span className="text-sm text-gray-500">• {tourService.reviewCount} đánh giá</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Giá mỗi người:</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">{formatCurrency(tourService.price)}</span>
                <p className="text-xs text-gray-500">Đã bao gồm VAT</p>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Mô tả tour</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{tourService.tourDesc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
