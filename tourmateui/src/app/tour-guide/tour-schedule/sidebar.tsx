'use client';

import React, { useState, useEffect, type FC } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  MapPin,
  User,
  StretchHorizontalIcon,
  MessageCircleMore,
  CalendarCheck,
  ChevronsUpDown,
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '@/types/jwt-payload';
import { TourGuide } from '@/types/tour-guide';
import { getTourGuideByAccountId } from '@/api/tour-guide.api';

type TourGuideSidebarProps = {
  onNavItemClick?: (label: string) => void;
};

const TourGuideSidebar: FC<TourGuideSidebarProps> = ({ onNavItemClick }) => {
  const [selectedNav, setSelectedNav] = useState('Chờ xác nhận');
  const [tourGuide, setTourGuide] = useState<TourGuide>();

  // Decode token
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
  let accountName = '';
  let accountId = '';
  let role = '';

  if (token) {
    try {
      const decoded: MyJwtPayload = jwtDecode<MyJwtPayload>(token);
      accountName = decoded?.FullName || '';
      accountId = decoded?.AccountId?.toString() || '';
      role = decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
    } catch {}
  }

  useEffect(() => {
    if (!accountId) return;
    getTourGuideByAccountId(Number(accountId))
      .then(setTourGuide)
      .catch(console.error);
  }, [accountId]);

  const navigationItems = [
    { label: 'Chờ xác nhận', icon: Calendar },
    { label: 'Lịch hẹn sắp tới', icon: CalendarCheck },
    { label: 'Tour đã hướng dẫn', icon: MapPin },
  ];

  const actionCards = [
    { label: 'Hồ sơ', icon: User, bgColor: 'bg-red-500', href: '/tour-guide/profile' },
    { label: 'Đấu giá', icon: StretchHorizontalIcon, bgColor: 'bg-emerald-500', href: '/tour-guide/bids' },
    { label: 'Tin nhắn', icon: MessageCircleMore, bgColor: 'bg-blue-500', href: '/chat' },
  ];

  const labelToStatus: Record<string, string> = {
    'Chờ xác nhận': 'pending',
    'Lịch hẹn sắp tới': 'confirmed',
    'Tour đã hướng dẫn': 'confirmed',
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-gray-100 p-5 mb-4 md:mb-0 md:mx-0">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl shadow-sm">
        <Avatar className="h-12 w-12 shadow-md mt-4">
          <AvatarImage src={tourGuide?.image} />
          <AvatarFallback className="bg-blue-600 text-white font-semibold">TG</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-lg text-gray-900 truncate">
            {token ? accountName || 'Người dùng' : 'Chưa đăng nhập'}
          </h2>
          {token && (
            <>
              <p className="text-xs text-gray-500 truncate">ID: {accountId}</p>
              <p className="text-xs text-gray-500 truncate">{role}</p>
            </>
          )}
        </div>
        {token && <ChevronsUpDown className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />}
      </div>

      <div className="border-t border-gray-300 mb-6"></div>

      {/* Action Cards */}
      {token && (
        <div className="grid grid-cols-3 gap-2 mb-6">
          {actionCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              title={card.label}
              className={`${card.bgColor} rounded-lg flex flex-col items-center justify-center p-3 sm:p-4 cursor-pointer shadow-md border border-transparent transition transform hover:-translate-y-1 hover:shadow-lg`}
            >
              <card.icon className="h-7 w-7 text-white mb-1" />
              <span className="text-xs font-semibold text-white text-center">{card.label}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="border-t border-gray-300 mb-6"></div>

      {/* Navigation Menu */}
      <nav className="flex flex-col space-y-2 mb-6">
        {navigationItems.map((item) => {
          const isSelected = selectedNav === item.label;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setSelectedNav(item.label);
                // Truyền status code sang parent để fetch lại data đúng status
                const statusCode = labelToStatus[item.label];
                onNavItemClick?.(statusCode);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-medium transition-colors duration-300 ${
                isSelected
                  ? 'bg-blue-100 text-blue-700 border border-blue-400'
                  : 'text-gray-700 border border-transparent hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-300 mb-4"></div>
    </div>
  );
};

export default TourGuideSidebar;
