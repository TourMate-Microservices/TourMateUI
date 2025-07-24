import { Heart, Share2, MapPin, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/utils/date-utils"
import { TourServiceBooking } from "@/types/invoice"

interface HeroSectionProps {
  tourService: TourServiceBooking
}

export function HeroSection({ tourService }: HeroSectionProps) {
  return (
    <div className="relative h-96 overflow-hidden">
      <img
        src={tourService.image || "/placeholder.svg"}
        alt={tourService.serviceName}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">{tourService.title}</h1>
              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-5 h-5" />
                  <span>{tourService.areaName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-5 h-5" />
                  <span>{formatDuration(tourService.duration)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>
                    {tourService.rating} ({tourService.reviewCount} đánh giá)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Heart className="w-4 h-4 mr-2" />
                Yêu thích
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
