"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Logo from "@/public/logo.png"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import ActionMenu from "./action-menu"
import { RoleSelectionModal } from "./role-selection-modal"

const MegaMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const currentRoute = usePathname()

  useEffect(() => {
    setIsMounted(true)

    const storedToken = sessionStorage.getItem("accessToken")
    setToken(storedToken)
  }, [token])

  const handleUnauthorizedAccess = (e: React.MouseEvent, service: string) => {
    e.preventDefault()
    alert(`Vui lòng đăng nhập để sử dụng dịch vụ ${service}`)
  }

  if (!isMounted) return null

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Left side */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image src={Logo || "/placeholder.svg"} className="h-16 w-16 transition-transform" alt="TourMate Logo" />
            </motion.div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center flex-1 justify-center">
            <div className="flex items-center space-x-1">
              <Link
                href="/"
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentRoute === "/"
                  ? "text-blue-600 bg-blue-50 shadow-sm"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
              >
                Trang chủ
              </Link>

              <Link
                href="/active-area"
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentRoute === "/active-area"
                  ? "text-blue-600 bg-blue-50 shadow-sm"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
              >
                Địa điểm hoạt động
              </Link>

              <Link
                href="/tour-guide"
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentRoute === "/tour-guide"
                  ? "text-blue-600 bg-blue-50 shadow-sm"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
              >
                Hướng dẫn viên
              </Link>

              {token ? (
                <Link
                  href="/chat"
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentRoute === "/chat"
                      ? "text-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Tin nhắn
                </Link>
              ) : (
                <button
                  onClick={(e) => handleUnauthorizedAccess(e, "tin nhắn")}
                  className="px-5 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                >
                  Tin nhắn
                </button>
              )}

              {/* Services Dropdown - can be removed or kept for future services */}
              {/* Uncomment below if you want to keep a services dropdown for other items
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className={`flex items-center px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentRoute.startsWith("/services/")
                    ? "text-blue-600 bg-blue-50 shadow-sm"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                >
                  Dịch vụ khác
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 py-6 z-50"
                    >
                      <div className="px-6 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Dịch vụ khác</h3>
                        <p className="text-sm text-gray-500">Các dịch vụ bổ sung</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              */}       
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {token ? (
                <ActionMenu />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-xl hover:bg-gray-50"
                  >
                    Đăng nhập
                  </Link>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Đăng ký
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <RoleSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  )
}

export default MegaMenu
