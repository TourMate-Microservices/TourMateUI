"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function BookTourIndex() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Chọn tour để đặt</h3>
        <p className="text-gray-600 mb-6">Vui lòng chọn một tour cụ thể để tiến hành đặt tour.</p>
        <div className="space-y-3">
          <Button 
            onClick={() => router.push("/")} 
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Xem danh sách tour
          </Button>
        </div>
      </div>
    </div>
  )
}
