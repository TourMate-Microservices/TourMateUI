'use client'
import { useQuery } from '@tanstack/react-query';
import React, { use, useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaRegClock, FaFacebookMessenger, FaRegMap, FaRegUser, FaSuitcaseRolling, FaCheck } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import SafeImage from '@/components/safe-image';
import "@/app/globals.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from 'next/navigation';
import bannerImg from '@/public/tour-guide-list-banner.png';
import TourServices from './services';
import { TourGuideDetail } from '@/types/tour-guide-detail';
import MegaMenu from '@/components/mega-menu';
import Footer from '@/components/footer';
import { getTourGuideWithServices } from '@/api/tour-guide.api';
import Banner from '@/components/Banner';

export default function TourGuideDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const statToRender = (t: TourGuideDetail) => [
    {
      icon: <FaRegMap size={25} />,
      value: t.tourGuide.address || 'Chưa có địa điểm',
      name: 'Địa điểm hoạt động',
    },
    {
      icon: <FaRegClock size={25} />,
      value: dayjs(t.tourGuide.dateOfBirth).format('DD/MM/YYYY'),
      name: 'Ngày sinh',
    },
    {
      icon: <FaSuitcaseRolling size={25} />,
      value: t.tourGuide.yearOfExperience ? `${t.tourGuide.yearOfExperience} năm` : 'Chưa có kinh nghiệm',
      name: 'Số năm kinh nghiệm',
    },
    {
      icon: <FaRegUser size={25} />,
      value: t.tourGuide.gender || 'Chưa rõ',
      name: 'Giới tính',
    },
    {
      icon: <FaMapMarkerAlt size={25} />,
      value: t.tourGuide.address || 'Chưa có địa chỉ',
      name: 'Địa chỉ',
    },
    {
      icon: <FaPhoneAlt size={25} />,
      value: t.tourGuide.phone || 'Chưa có số điện thoại',
      name: 'Số điện thoại',
    },
  ];

  const { id } = use(params);
  const router = useRouter();

  const tourGuideData = useQuery({
    queryKey: ['tour-guide', id],
    queryFn: () => getTourGuideWithServices(id),
    staleTime: 24 * 3600 * 1000,
  });

  const tourGuide = tourGuideData.data;
  const [displayDesc, setDisplayDesc] = useState(true);

  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    });
  }, []);

  const token = sessionStorage.getItem('accessToken');

  return (
    <>
      <MegaMenu />
      <div className="space-y-10" data-aos="fade-in" data-aos-delay="300">
        <Banner imageUrl={bannerImg} title="THÔNG TIN HƯỚNG DẪN VIÊN" />

        <div className="w-[85%] mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <SafeImage
              src={tourGuide?.tourGuide.image}
              alt={tourGuide?.tourGuide.fullName}
              className="w-full h-60 object-cover border-2 rounded-md"
            />

            <div className="md:col-span-2 space-y-4">
              <h4 className="text-3xl font-bold text-gray-800">
                {tourGuide?.tourGuide.fullName}{' '}
                {tourGuide?.tourGuide.isVerified && <FaCheck className="text-blue-500 inline ml-1" />}
              </h4>

              {tourGuide && (
                <table className="table-auto w-full text-left">
                  <tbody>
                    {statToRender(tourGuide).map((v, i) => (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="py-2 pr-4 whitespace-nowrap font-medium flex items-center gap-3 text-gray-700">
                          {v.icon} {v.name}
                        </td>
                        <td className="py-2 text-gray-600">{v.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-end md:col-span-3">
              {/* Chat button here if needed */}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Giới thiệu</h2>
              <Button
                onClick={() => setDisplayDesc((p) => !p)}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                {displayDesc ? 'Ẩn' : 'Hiện'}
              </Button>
            </div>

            <div
              className={`text-justify text-gray-700 ${displayDesc ? 'block pb-5' : 'hidden'}`}
              dangerouslySetInnerHTML={{
                __html:
                  tourGuide?.tourGuide.description
                    ? tourGuide.tourGuide.description.replace(
                      /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))/gi,
                      (match) =>
                        `<img src="${match}" alt="Image" style="max-width: 100%; height: auto; object-fit: contain;" />`
                    )
                    : 'Không có mô tả',
              }}
            />
          </div>
        </div>

        <div className="w-[85%] mx-auto shadow-xl rounded-xl p-6 bg-white">
          {id && <TourServices data={tourGuide?.tours} />}
        </div>
      </div>
      <Footer />
    </>
  );
}