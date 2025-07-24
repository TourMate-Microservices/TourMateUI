"use client"

import { CreditCard, Bookmark } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/utils/date-utils"
import { BookingFormData, TourServiceBooking } from "@/types/invoice"

interface BookingDialogProps {
  isOpen: boolean
  onClose: () => void
  tourService: TourServiceBooking
  selectedDate: Date
  selectedTimeSlot: string
  formData: BookingFormData
  onFormDataChange: (data: Partial<BookingFormData>) => void
  onConfirmBooking: () => void
}

export function BookingDialog({
  isOpen,
  onClose,
  tourService,
  selectedDate,
  selectedTimeSlot,
  formData,
  onFormDataChange,
  onConfirmBooking,
}: BookingDialogProps) {
  const calculateTotal = () => {
    const people = Number.parseInt(formData.selectedPeople)
    const basePrice = tourService.price * people
    const serviceFee = basePrice * 0.05
    return basePrice + serviceFee
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Đặt Tour</DialogTitle>
          <DialogDescription className="text-base">
            {tourService.title} • {selectedDate.toLocaleDateString("vi-VN")} lúc {selectedTimeSlot}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Number of People */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Số lượng khách</Label>
            <Select
              value={formData.selectedPeople}
              onValueChange={(value: string) => onFormDataChange({ selectedPeople: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Chọn số người" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} người
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Booking Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Hình thức đặt tour</Label>
            <RadioGroup
              value={formData.bookingType}
              onValueChange={(value: string) => onFormDataChange({ bookingType: value })}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-green-50 transition-colors">
                <RadioGroupItem value="pay-now" id="pay-now" />
                <div className="flex-1">
                  <Label htmlFor="pay-now" className="flex items-center cursor-pointer">
                    <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                    <div>
                      <div className="font-medium">Thanh toán ngay</div>
                      <div className="text-sm text-gray-600">Xác nhận tour ngay lập tức</div>
                    </div>
                  </Label>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Khuyến nghị
                </Badge>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                <RadioGroupItem value="hold-slot" id="hold-slot" />
                <div className="flex-1">
                  <Label htmlFor="hold-slot" className="flex items-center cursor-pointer">
                    <Bookmark className="w-5 h-5 mr-2 text-blue-600" />
                    <div>
                      <div className="font-medium">Giữ chỗ</div>
                      <div className="text-sm text-gray-600">Giữ chỗ trong 24h, thanh toán sau</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Note */}
          <div className="space-y-3">
            <Label htmlFor="note" className="text-base font-semibold">
              Ghi chú đặc biệt
            </Label>
            <Textarea
              id="note"
              placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm, nhu cầu hỗ trợ..."
              className="min-h-[80px]"
              value={formData.note}
              onChange={(e) => onFormDataChange({ note: e.target.value })}
            />
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
            <h4 className="font-semibold">Chi tiết giá</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Giá tour ({formData.selectedPeople} người)</span>
                <span>{formatCurrency(tourService.price * Number.parseInt(formData.selectedPeople))}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí dịch vụ (5%)</span>
                <span>{formatCurrency(tourService.price * Number.parseInt(formData.selectedPeople) * 0.05)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-green-600">
                <span>Tổng cộng</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
            {formData.bookingType === "hold-slot" && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                💡 Chỉ cần thanh toán 20% để giữ chỗ ({formatCurrency(calculateTotal() * 0.2)})
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Hủy
          </Button>
          <Button
            onClick={onConfirmBooking}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            {formData.bookingType === "pay-now" ? (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Thanh toán {formatCurrency(calculateTotal())}
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 mr-2" />
                Giữ chỗ {formatCurrency(calculateTotal() * 0.2)}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
