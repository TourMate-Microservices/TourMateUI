import { FC, useState } from 'react';
import { TourFeedbackModal } from './tour-feedback-modal';
import { Download, Edit, Send, Star, XCircle } from "lucide-react";
import { TourSchedule } from '@/types/tour-schedule';
import { format } from 'date-fns'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteInvoice } from '@/api/invoice.api';
import { toast } from 'react-toastify';
import DeleteModal from '@/components/delete-modal';
import { useRouter } from 'next/navigation';
import { getTourFeedbackByInvoice } from '@/api/feedback.api';


const statusStyles: Record<string, string> = {
  'Chờ xác nhận': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  'Sắp diễn ra': 'bg-blue-100 text-blue-800 border border-blue-300',
  'Đã hướng dẫn': 'bg-green-100 text-green-800 border border-green-300',
  'Từ chối': 'bg-red-100 text-red-800 border border-red-300',
};

function mapStatus(status: string): string {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận';
    case 'confirmed':
      return 'Đã hướng dẫn';
    case 'upcoming':
      return 'Sắp diễn ra';
    case 'rejected':
      return 'Từ chối';
    default:
      return status;
  }
}


interface ScheduleCardProps {
  invoiceId: number;
  customerName: string;
  customerPhone: string;
  tourGuideName: string;
  tourGuidePhone: string;
  email: string;
  tourName: string;
  tourDesc: string;
  areaName: string;
  startDate: string;
  endDate: string;
  peopleAmount: string;
  price: number;
  paymentMethod: string;
  status: string;
  note: string;
  createdDate: string;
  customerAccountId: number;
  customerId: number;
  tourGuideId: number;
}

const ScheduleCard: FC<ScheduleCardProps> = ({
  invoiceId,
  customerName,
  customerPhone,
  tourGuideName,
  tourGuidePhone,
  email,
  tourName,
  tourDesc,
  areaName,
  startDate,
  endDate,
  peopleAmount,
  price,
  paymentMethod,
  status,
  note,
  createdDate,
  customerAccountId,
  customerId,
  tourGuideId,
}) => {

  const queryClient = useQueryClient();


  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null); // Store item to delete
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)


  const { data: existingFeedback, isLoading: isFeedbackLoading } = useQuery({
    queryKey: ["tour-feedback", invoiceId],
    queryFn: () => getTourFeedbackByInvoice(Number(invoiceId)),
    enabled: status === "Đã hướng dẫn",
    retry: false, // Don't retry if no feedback found
  })

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  // Handle delete confirmation (directly inside this component)
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete);
    }
    closeDeleteModal();
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => deleteInvoice(id),
    onSuccess: () => {
      toast.success(`Xóa lịch hẹn thành công`);
      queryClient.invalidateQueries({
        queryKey: ["tour-schedules"],
        exact: false,
      });
    },
  });

    const router = useRouter();

    const hasFeedback = existingFeedback && !existingFeedback.isDeleted
  

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
        {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="font-semibold text-lg text-gray-900">Mã lịch hẹn: {invoiceId}</h2>
          <button
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            onClick={() => alert(`Downloading lịch hẹn ${invoiceId}`)}
          >
            <Download className="w-4 h-4" />
            Tải về
          </button>
        </div>

        {/* Trạng thái và ngày tạo */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="text-md text-gray-500 whitespace-nowrap font-medium">Trạng thái:</p>
            <span className={`text-sm px-3 py-1 rounded-sm font-medium ${statusStyles[mapStatus(status)]}`}>
              {mapStatus(status)}
            </span>
          </div>
          <p className="text-md text-gray-500 whitespace-nowrap font-medium">
            Ngày tạo: {new Date(createdDate).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>

        <hr className="border-gray-200" />

        {/* Thông tin khách hàng */}
        <p className="text-lg font-semibold text-black">👤 {customerName} ({email})</p>
        <p className="text-gray-600">📞 {customerPhone}</p>

        {/* Thông tin tour */}
        <div className="space-y-1 text-gray-700">
          <p>🧭 <strong>{tourName}</strong></p>
          <p>🧑‍🏫 Hướng dẫn viên: {tourGuideName}</p>
          <p>📞 SĐT hướng dẫn viên: {tourGuidePhone}</p>
          <p>🌍 Khu vực: {areaName}</p>
          <p>
            📅 Thời gian: {format(new Date(startDate), 'dd/MM/yyyy HH:mm')}
            {endDate ? ` - ${format(new Date(endDate), 'dd/MM/yyyy HH:mm')}` : ''}
          </p>

          <p>👥 Số lượng người: {peopleAmount}</p>
          <p>💰 Giá: {price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
          <p>💳 Phương thức thanh toán: {paymentMethod}</p>
          {note && (
            <div className="my-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded-md flex items-start gap-2">
              <span>📝</span>
              <p className="italic">{note}</p>
            </div>
          )}

          {/* Hiển thị tourDesc với innerHTML */}
          <p
            className="text-md text-gray-500"
            dangerouslySetInnerHTML={{ __html: tourDesc }}
          />
        </div>

        {/* Show existing feedback preview if available */}
          {hasFeedback && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-orange-800">Đánh giá của bạn:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= existingFeedback.rating ? "fill-orange-400 text-orange-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 italic line-clamp-2">&quot;{existingFeedback.content}&quot;</p>
              <p className="text-xs text-gray-500 mt-1">
                Đánh giá lúc: {new Date(existingFeedback.createdDate).toLocaleString("vi-VN")}
              </p>
            </div>
          )}


        <div className="flex pt-2">
          <div className="ml-auto flex gap-2">
            {mapStatus(status) === 'Sắp diễn ra' && (
              <button onClick={() => {
                router.push(`/chat?userId=${customerAccountId}`);
              }} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition flex items-center">
                <Send className="inline-block w-4 h-4 mr-1" />
                Liên hệ
              </button>
            )}

            {status === "confirmed" && (
                <button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  disabled={isFeedbackLoading}
                  className={`text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition flex items-center ${
                    hasFeedback ? "bg-blue-500 hover:bg-blue-600" : "bg-orange-500 hover:bg-orange-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isFeedbackLoading ? (
                    <>
                      <div className="inline-block w-4 h-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Đang tải...
                    </>
                  ) : hasFeedback ? (
                    <>
                      <Edit className="inline-block w-4 h-4 mr-1" />
                      Đánh giá lại
                    </>
                  ) : (
                    <>
                      <Star className="inline-block w-4 h-4 mr-1" />
                      Đánh giá
                    </>
                  )}
                </button>
              )}
              
            {/* {mapStatus(status) === 'Chờ xác nhận' && (
              <button
                onClick={() => {
                  setItemToDelete(invoiceId);
                  openDeleteModal();
                }}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition flex items-center"
              >
                <XCircle className="inline-block w-4 h-4 mr-1" />
                Huỷ bỏ
              </button>
            )} */}
          </div>
        </div>
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          message="Bạn có chắc muốn xóa lịch hẹn này?"
        />
      </div>
      <TourFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        invoiceId={invoiceId}
        customerId={customerId}
        tourGuideId={tourGuideId}
        tourName={tourName}
        tourGuideName={tourGuideName}
        existingFeedback={hasFeedback ? existingFeedback : null}
      />
    </div>
  );
};

export default ScheduleCard;
