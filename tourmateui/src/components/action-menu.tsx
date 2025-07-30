// ActionMenu.tsx
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Settings, LogOut, MapPin, CalendarCheck2, History, Wallet } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { MyJwtPayload } from "@/types/jwt-payload";
import { useToken } from "@/utils/get-token";
import CustomerProfile from "./customerProfile";

export default function ActionMenu() {

  const token = useToken("accessToken");
  const decoded: MyJwtPayload | null = token ? jwtDecode<MyJwtPayload>(token.toString()) : null;
  const accountName = decoded?.FullName;
  const accountId = decoded?.AccountId;
  const role = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string;

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer"
        >
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-blue-700">Menu người dùng</SheetTitle>
          <SheetDescription>
            Quản lý tài khoản và các hoạt động của bạn
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          <SheetTitle className=" px-4">Xin chào {accountName}</SheetTitle>
          <SheetDescription className=" px-4">
            ID: {accountId}
          </SheetDescription>
          {role === "Customer" ? (
            <>
              <CustomerProfile />
              <Link
                href={`/tour-schedule`}
                className="w-full flex items-center gap-3 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                <CalendarCheck2 size={18} />
                Xem lịch trình
              </Link>
            </>
          ) : role === "TourGuide" ? (
            <>
              <Link
                href={`/tour-guide/edit-profile`}
                className="w-full flex items-center gap-3 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                <Settings size={18} />
                Thông tin tài khoản
              </Link>

              <Link
                href={`/tour-guide/create-tour`}
                className="w-full flex items-center gap-3 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                <MapPin size={18} />
                Tạo lịch Tour
              </Link>
              <Link
                href={`/tour-guide/tour-schedule`}
                className="w-full flex items-center gap-3 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                <CalendarCheck2 size={18} />
                Quản lý lịch trình
              </Link>
              <Link
                href={`/tour-guide/revenue`}
                className="w-full flex items-center gap-3 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                <Wallet size={18} />
                Doanh thu
              </Link>
            </>
          ) : (
            <button
              className="w-full flex items-center gap-3 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md"
              onClick={() => alert("Chức năng chưa hỗ trợ")}
            >
              <Settings size={18} />
              Thông tin tài khoản
            </button>
          )}
          <Link
            href={`/payment/history`}
            className="w-full flex items-center gap-3 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md"
          >
            <History size={18} />
            Lịch sử thanh toán
          </Link>
          <button
            className="w-full flex items-center gap-3 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md font-semibold"
            onClick={() => {
              sessionStorage.removeItem("accessToken");
              sessionStorage.removeItem("refreshToken");
              window.location.href = "/"; // hoặc "/" tùy theo app bạn điều hướng
            }}
          >
            <LogOut size={18} />
            Đăng xuất
          </button>

        </div>
      </SheetContent>
    </Sheet>
  );
}
