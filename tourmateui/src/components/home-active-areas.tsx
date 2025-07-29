"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { Calendar, ArrowRight, Clock } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"
import { getActiveAreas } from "@/api/active-area.api"

export default function HomeActiveAreas() {
  const [page, setPage] = useState(1)
  const pageSize = 3
  const { data } = useQuery({
    queryKey: ["active-areas", pageSize, page],
    queryFn: async () => await getActiveAreas(page, pageSize), // exclude content for performance
    staleTime: 24 * 3600 * 1000,
  })
  const maxPage = data?.total_pages ?? 0

  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setPage((p) => (p < maxPage ? p + 1 : 1))
    }, 5000) // đổi trang mỗi 5 giây
    return () => clearInterval(timer)
  }, [page, maxPage])


  const isLoading = !data || !data.data;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Khám phá</span>{" "}
            các điểm đến nổi bật
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Những địa điểm du lịch hấp dẫn, nổi bật và được yêu thích nhất hiện nay trên TourMate
          </p>

          {/* Page indicator */}
          {maxPage > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {[...Array(maxPage)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i + 1 === page ? "bg-blue-600 w-8" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Grid with Animation or Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/80 rounded-3xl shadow-xl overflow-hidden border border-gray-200 animate-pulse"
                    >
                      <div className="relative overflow-hidden">
                        <div className="w-full h-48 bg-gray-200" />
                        <div className="absolute top-4 left-4 bg-white/90 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                          <div className="h-4 w-4 bg-blue-200 rounded-full" />
                          <div className="h-4 w-20 bg-gray-200 rounded" />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                          <div className="h-4 w-4 bg-gray-200 rounded-full" />
                          <div className="h-4 w-16 bg-gray-200 rounded" />
                        </div>
                        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded mb-4" />
                        <div className="h-10 w-32 bg-blue-200 rounded-xl mx-auto" />
                      </div>
                    </div>
                  ))
                : data?.data.map((item, index) => (
                    <motion.div
                      key={item.areaId}
                      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-500 group hover:scale-[1.02] hover:-translate-y-1"
                      data-aos="fade-up"
                      data-aos-delay={300 + index * 100}
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={item.bannerImg || "/placeholder.svg"}
                          alt={item.areaTitle}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Date badge */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            {dayjs(item.createdAt).format("DD/MM/YYYY")}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <Clock className="h-4 w-4" />
                          <span>{dayjs(item.createdAt).format("HH:mm")}</span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                          {item.areaTitle}
                        </h3>
                        {/* Subtitle */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {item.areaSubtitle || "Khám phá vẻ đẹp, văn hóa và trải nghiệm độc đáo tại khu vực này. Địa điểm lý tưởng cho những ai yêu thích du lịch và khám phá."}
                        </p>
                        {/* CTA Button */}
                        <Link
                          href={"/active-area/" + item.areaId}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group/btn font-semibold"
                        >
                          Khám phá ngay
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                      {/* Hover effect gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </motion.div>
                  ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="600">
          <Link
            href="/active-area"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group"
          >
            Xem tất cả điểm đến
            <ArrowRight className="h-5 w-5 ml-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
