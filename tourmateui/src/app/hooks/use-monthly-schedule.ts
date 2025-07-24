"use client"

import { useState, useCallback } from "react"
import { TourScheduleService } from "@/services/tour-service"
import { getMonthKey } from "@/utils/date-utils"
import { MonthlyScheduleRequest, TourGuideSchedule } from "@/types/invoice"

export function useMonthlySchedule(tourGuideId: number) {
  const [schedules, setSchedules] = useState<Map<string, TourGuideSchedule[]>>(new Map())
  const [loading, setLoading] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  /**
   * Load lịch trình theo tháng từ API
   * Gọi API /schedules/monthly để lấy tất cả booking của HDV trong tháng
   */
  const loadMonthSchedule = useCallback(
    async (date: Date) => {
      const monthKey = getMonthKey(date)

      if (schedules.has(monthKey) || loading.has(monthKey)) {
        return
      }

      setLoading((prev) => new Set(prev).add(monthKey))
      setError(null)

      try {
        const request: MonthlyScheduleRequest = {
          tourGuideId,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
        }

        const response = await TourScheduleService.getMonthlySchedule(request)
        setSchedules((prev) => new Map(prev).set(monthKey, response.schedules))
      } catch (err) {
        console.error("Failed to load schedule:", err)
        setError("Không thể tải lịch trình")
        // Set empty array để UI vẫn hiển thị được
        setSchedules((prev) => new Map(prev).set(monthKey, []))
      } finally {
        setLoading((prev) => {
          const newSet = new Set(prev)
          newSet.delete(monthKey)
          return newSet
        })
      }
    },
    [tourGuideId, schedules, loading],
  )

  const getSchedulesForMonth = useCallback(
    (date: Date): TourGuideSchedule[] => {
      const monthKey = getMonthKey(date)
      return schedules.get(monthKey) || []
    },
    [schedules],
  )

  const isLoadingMonth = useCallback(
    (date: Date): boolean => {
      const monthKey = getMonthKey(date)
      return loading.has(monthKey)
    },
    [loading],
  )

  return {
    loadMonthSchedule,
    getSchedulesForMonth,
    isLoadingMonth,
    error,
    clearCache: () => {
      setSchedules(new Map())
      setLoading(new Set())
      setError(null)
      TourScheduleService.clearCache()
    },
  }
}
