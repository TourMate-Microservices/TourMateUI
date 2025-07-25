'use client';
import { TourGuideResponse } from '@/types/area-detail-response';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

export default function TourGuidesInArea({ data, currentName }: { data?: TourGuideResponse[], currentName?: string }) {


  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-[#f9fbfc] px-4 py-10 text-center">
        <h2 className="text-2xl font-semibold text-[#3e72b9] mb-2">
          Rất tiếc!
        </h2>
        <p className="text-gray-600 text-base max-w-md">
          Hiện tại chưa có hướng dẫn viên nào được ghi nhận trong khu vực này. Vui lòng quay lại sau hoặc chọn khu vực khác để tiếp tục khám phá.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-[#f9fbfc] min-h-screen py-8 px-4 max-w-4xl mx-auto"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      <h1 className="text-3xl italic text-[#3e72b9] font-normal mb-8 text-center">
        Hướng dẫn viên tại<br /> {currentName || "Khu vực chưa xác định"}
      </h1>

      <AnimatePresence mode="wait">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {data.map((guide) => (
            <motion.div
              key={guide.tourGuideId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={guide.image}
                  alt={guide.fullName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">{guide.fullName}</h2>
                  <p className="text-sm text-gray-600">
                    {guide.yearOfExperience ?
                      guide.yearOfExperience + ' Năm kinh nghiệm' :
                      ''
                    }
                  </p>
                </div>
              </div>

              <p className="italic text-gray-700 mb-4" dangerouslySetInnerHTML={{
                __html: guide.description,
              }} />

              <Link
                href={`/tour-guide/${guide.tourGuideId}`}
                className="block w-max mt-6 py-2 px-4 bg-[#e5eaf3] text-gray-800 font-medium rounded-md hover:bg-[#dce4f0] transition mx-auto"
              >
                Đặt chuyến đi ngay
              </Link>

            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}
