'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import dayjs from 'dayjs'
import Link from 'next/link'
import AOS from 'aos'
import 'aos/dist/aos.css'

import PaginateList from '@/components/paginate-list'
import { Tour } from '@/types/tour-guide-detail'
// Không dùng mock nữa, nhận tours từ props

export default function TourServices({ tours }: { tours: Tour[] }) {
  const [page, setPage] = useState(1)
  const pageSize = 6
  const totalPage = Math.ceil((tours?.length ?? 0) / pageSize)
  const start = (page - 1) * pageSize
  const services = tours?.slice(start, start + pageSize) ?? []

  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    })
  }, [])

  return (
    <motion.div className="w-full" data-aos="fade-up" data-aos-duration="3000">
      <h2 className="text-blue-800 text-3xl font-semibold mb-5">
        Dịch vụ du lịch
      </h2>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((item) => (
            <motion.div
              key={item.serviceId}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transform transition-all"
            >
              <img
                src={item.image}
                alt={item.serviceName}
                className="w-full h-[280px] object-cover"
              />
              <div className="flex justify-between items-start p-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {dayjs(item.createdDate).format('DD/MM/YYYY HH:mm:ss')}
                  </p>
                  <h3 className="font-semibold text-lg mb-2">
                    {item.serviceName}
                  </h3>
                </div>
                <Link
                  href={`/tour-service/?id=${item.serviceId}`}
                  className="text-nowrap text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  Xem ngay
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="mt-10">
        <PaginateList
          current={page}
          maxPage={totalPage}
          onClick={(p) => setPage(p)}
        />
      </div>
    </motion.div>
  )
}
