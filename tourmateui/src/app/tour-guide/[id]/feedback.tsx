import { Feedback } from '@/types/feedbacks'
import { PagedResult } from '@/types/paged-result'
import React, { useEffect, useState } from 'react'
import AOS from "aos";
import { Calendar, ChevronLeft, ChevronRight, MessageSquare, Star, User } from 'lucide-react';
import SafeImage from '@/components/safe-image';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';

export default function Feedbacks({ feedbacks, }: { feedbacks?: PagedResult<Feedback> }) {
    const [currentPage, setCurrentPage] = useState(1)
    const items = feedbacks?.data ?? []
    const totalPages = feedbacks?.total_pages || 1
    const totalFeedbacks = feedbacks?.total_count || 0
    const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: items.filter((f) => f.rating === rating).length,
    }))
    useEffect(() => {
        AOS.init({
            offset: 0,
            delay: 200,
            duration: 1200,
            once: true,
        });
    }, []);

    const getRatingText = (rating: number) => {
        switch (rating) {
            case 5:
                return "Xuất sắc"
            case 4:
                return "Tốt"
            case 3:
                return "Bình thường"
            case 2:
                return "Kém"
            case 1:
                return "Rất kém"
            default:
                return ""
        }
    }
    const getRatingColor = (rating: number) => {
        if (rating >= 4) return "text-green-600"
        if (rating >= 3) return "text-yellow-600"
        return "text-red-600"
    }
    const avg = (ratings: number[]) => {
        let s = 0
        ratings.forEach(v => s = s + v)
        return s / (totalFeedbacks === 0 ? 1 : totalFeedbacks)
    }
    const averageRating = avg(ratingCounts.map(v => v.count * v.rating))
    return (
        <div className="w-full space-y-6" data-aos="fade-up" data-aos-duration="3000">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Đánh giá từ khách hàng</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageSquare className="h-4 w-4" />
                    <span>{totalFeedbacks} đánh giá</span>
                </div>
            </div>

            {totalFeedbacks > 0 ? (
                <>
                    {/* Statistics Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Average Rating */}
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <span className="text-4xl font-bold text-blue-600">{averageRating}</span>
                                    <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                                </div>
                                <p className="text-sm text-gray-600">Điểm trung bình</p>
                                <p className="text-xs text-gray-500">({totalFeedbacks} đánh giá)</p>
                            </div>

                            {/* Rating Distribution */}
                            <div className="md:col-span-2">
                                <h4 className="font-medium text-gray-800 mb-3">Phân bố đánh giá</h4>
                                <div className="space-y-2">
                                    {ratingCounts.map(({ rating, count }) => (
                                        <div key={rating} className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 w-12">
                                                <span className="text-sm font-medium">{rating}</span>
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            </div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${items.length > 0 ? (count / items.length) * 100 : 0}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback List */}
                    <div className="space-y-4">
                        {items.map((feedback) => (
                            <div key={feedback.feedbackId} className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <SafeImage
                                                src={feedback.customerAvatar || "/default-avatar.png"}
                                                alt={feedback.customerName || "Khách hàng"}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{feedback.customerName || "Khách hàng"}</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="h-3 w-3" />
                                                <span>{dayjs(feedback.date).format('DD/MM/YYYY')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${star <= feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className={`text-sm font-semibold ${getRatingColor(feedback.rating)}`}>
                                            {getRatingText(feedback.rating)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                {feedback.content && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 leading-relaxed italic">&quot;{feedback.content}&quot;</p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">Mã tour: #{feedback.invoiceId}</span>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <User className="h-3 w-3" />
                                        <span>Đánh giá đã xác thực</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-4 mt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Trước
                            </Button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = i + 1
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(pageNum)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {pageNum}
                                        </Button>
                                    )
                                })}
                                {totalPages > 5 && (
                                    <>
                                        <span className="text-gray-500">...</span>
                                        <Button
                                            variant={currentPage === totalPages ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(totalPages)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {totalPages}
                                        </Button>
                                    </>
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="flex items-center gap-2"
                            >
                                Tiếp
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đánh giá nào</h3>
                            <p className="text-gray-600">Hướng dẫn viên này chưa nhận được đánh giá từ khách hàng</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
