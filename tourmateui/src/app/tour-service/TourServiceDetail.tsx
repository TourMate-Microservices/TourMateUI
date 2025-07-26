"use client";

import { useQueryString } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { getTourService } from "@/api/tour-service.api";
import { getTourGuide } from "@/api/tour-guide.api";
import OtherServices from "./otherService";
import OtherAreas from "./otherArea";
import HotAreas from "./hotArea";
import OtherTourGuides from "./otherTourGuide";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToken } from "@/components/getToken";
import Banner from "@/components/Banner";
import Feedbacks from "./feedbacks";



export function TourServiceDetail() {
  const queryString: { id?: string } = useQueryString();
  const tourServiceId = Number(queryString.id) || 1;
  const router = useRouter();
  const token = useToken("accessToken");
  const { data, error, isLoading } = useQuery({
    queryKey: ["tour-service-detail", tourServiceId],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      return getTourService(tourServiceId);
    },
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 24 * 3600 * 1000,
  });

  const tourGuidId = data?.tourGuideId;
  const goToChat = () => {
    if (token) {
      router.push(`/chat?userId=${tourGuidId}`);
      return;
    }
    alert("Bạn cần đăng nhập để đặt lịch hoặc trò chuyện với hướng dẫn viên du lịch.");
  }

  if (isLoading) {
    return <div>Loading tour service...</div>;
  }

  if (error) {
    return <div>Error loading tour service!</div>;
  }

  return (
    <div className="flex flex-wrap">
      {/* Left content section */}
      <Banner
        imageUrl={
          data?.image ||
          "https://img.freepik.com/premium-photo/vietnam-flag-vintage-wood-wall_118047-4319.jpg?w=1380"
        }
        title={data?.serviceName || "No title available"}
        subtitle={data?.title || "No title available"}
      />
      <div
        className="w-full max-w-md mx-auto text-center mt-15"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <h1 className="italic text-4xl font-normal text-[#3e72b9]">Thông tin chuyến đi</h1>
        <p className="text-xs font-normal text-gray-400 tracking-wide uppercase mt-1">LỊCH TRÌNH VÀ ĐỊA ĐIỂM</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-5 py-10 px-4 md:px-15 min-h-screen">
        {/* LEFT CONTENT */}
        <div className="w-full md:w-[68%] overflow-y-auto pr-0 md:pr-4">
          <h1 className="mb-5 text-xl font-semibold">{data?.title}</h1>
          <div
            className="w-full quill-content text-justify"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                (data?.content || "").replace(
                  /(https?:\/\/[^\s"<>]+(?:png|jpg|jpeg|gif|bmp|svg))/gi,
                  (match) => {
                    return `<img src="${match}" alt="Image" style="width: 100%; height: auto; margin-bottom: 10px;" />`;
                  }
                )
              ),
            }}
          />
          <div className="flex flex-col sm:flex-row justify-between gap-4 px-4 py-5 bg-[#F2F8FB] rounded-lg mt-5">
            <Button
              onClick={goToChat}
              className="flex-1 px-6 py-6 bg-[#DBE4F7] text-black rounded text-center hover:bg-gray-300 transition-colors duration-300 font-semibold text-lg"
            >
              Giá cả: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.price || 0)}
            </Button>
            <Button
              onClick={goToChat}
              className="flex-1 px-6 py-6 bg-[#DBE4F7] text-black rounded text-center hover:bg-gray-300 transition-colors duration-300 font-semibold text-lg"
            >
              Đặt lịch
            </Button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full md:w-[30%] p-2 mt-10 md:mt-0">
          <div className="sticky top-30 flex flex-col gap-15 max-h-[calc(100vh-5rem)] overflow-auto">
            {/* Div 1 */}
            <div className="bg-[#F2F8FB] p-4 rounded-lg space-y-4">
              <h2 className="text-xl font-semibold text-center">THÔNG TIN</h2>
              <p className="text-center text-lg">{data?.serviceName}</p>
              <p className="text-center">{data?.tourDesc}</p>
            </div>
          </div> {/* <-- Đóng sticky div */}
        </div>

      </div>


      <div className="px-15 w-full min-w-full max-w-md mx-auto text-center">
        <hr className="border-gray-200 sm:w-full mx-auto mb-10" />
        <Feedbacks averageRating={0} feedbacks={data?.feedbacks} />
      </div>
      <div className="px-15 w-full min-w-full max-w-md mx-auto text-center">
        <hr className="border-gray-200 sm:w-full mx-auto mb-10" />
        <OtherServices tourGuideId={tourGuidId as number} serviceId={tourServiceId} />
      </div>
      <div className="px-15 py-15 w-full min-w-full max-w-md mx-auto text-center">
        <hr className="border-gray-200 sm:w-full mx-auto mb-10" />
        <OtherAreas />
      </div>
      <div className="px-15 w-full min-w-full max-w-md mx-auto text-center">
        <hr className="border-gray-200 sm:w-full mx-auto mb-10" />
        <OtherTourGuides tourGuideId={tourGuidId as number} />
      </div>
      <div className="px-15 py-15 w-full min-w-full max-w-md mx-auto text-center">
        <hr className="border-gray-200 sm:w-full mx-auto mb-10" />
        <HotAreas />
      </div>
    </div>
  );
};
