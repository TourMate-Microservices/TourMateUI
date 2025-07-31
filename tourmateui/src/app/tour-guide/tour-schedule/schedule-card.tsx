import { FC } from 'react';
import { Download, Send } from "lucide-react";
import { TourSchedule } from '@/types/tour-schedule';
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInvoiceStatus } from '@/api/invoice.api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


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


const ScheduleCard: FC<TourSchedule> = ({
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
  customerAccountId
}) => {

  const queryClient = useQueryClient();


  // Handle confirm status change
  const handleConfirmStatus = async () => {
    if (invoiceId) {
      confirmMutation.mutate(invoiceId);
    }
  };


  const confirmMutation = useMutation({
    mutationFn: (id: number | string) => updateInvoiceStatus(id, 'confirmed'),
    onSuccess: () => {
      toast.success(`Xác nhận lịch hẹn thành công`);
      queryClient.invalidateQueries({
        queryKey: ["tour-schedules"],
        exact: false,
      });
    },
    onError: () => {
      toast.error('Xác nhận lịch hẹn thất bại');
    }
  });

    const router = useRouter();
  

  return (
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
          {mapStatus(status) === 'Chờ xác nhận' && (
            <button
              onClick={handleConfirmStatus}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition flex items-center"
            >
              <Send className="inline-block w-4 h-4 mr-1" />
              Xác nhận
            </button>
          )}
        </div>
      </div>
      {/* Modal xóa đã bị loại bỏ, chỉ còn nút xác nhận */}
    </div>
  );
};

export default ScheduleCard;
