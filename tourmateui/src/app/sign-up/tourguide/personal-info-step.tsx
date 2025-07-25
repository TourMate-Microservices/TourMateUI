"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { TourGuideRegister } from "@/types/tour-guide"
import type { AreaIdAndName } from "@/types/active-area"
import { FormHeader } from "./form-header"
import { ImageUpload } from "./image-upload"

interface PersonalInfoStepProps {
    formData: TourGuideRegister
    error: string
    profileImage: string | null
    areas: AreaIdAndName[] | undefined
    areasLoading: boolean
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onProfileImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
    onBannerImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
    onNext: () => void
}

export function PersonalInfoStep({
    formData,
    error,
    profileImage,
    areas,
    areasLoading,
    onFormChange,
    onProfileImageUpload,
    onBannerImageUpload,
    onNext,
}: PersonalInfoStepProps) {
    return (
        <>
            <FormHeader title="Tạo Tài Khoản" subtitle="Nhập thông tin của bạn bên dưới để tạo tài khoản." />

            <ImageUpload label="Tải ảnh lên" imageUrl={profileImage} onImageUpload={onProfileImageUpload} isProfile={true} />

            <ImageUpload
                label="Tải ảnh bìa (Banner)"
                imageUrl={formData.bannerImage}
                onImageUpload={onBannerImageUpload}
                isProfile={false}
            />

            <div className="grid gap-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin cá nhân</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">Họ Tên</Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="John"
                            className="w-full"
                            required
                            value={formData.fullName}
                            onChange={onFormChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-muted-foreground"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </div>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                className="ps-10"
                                required
                                value={formData.dateOfBirth}
                                onChange={onFormChange}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        <select
                            id="gender"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            value={formData.gender}
                            onChange={onFormChange}
                        >
                            <option value="" disabled>
                                Chọn giới tính
                            </option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-muted-foreground"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 19 18"
                                >
                                    <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                                </svg>
                            </div>
                            <Input
                                id="phone"
                                type="tel"
                                className="ps-10"
                                placeholder="0123-456-789"
                                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                                required
                                value={formData.phone}
                                onChange={onFormChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin liên hệ</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">

                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={formData.email}
                            onChange={onFormChange}
                            required
                        />

                    </div>
                    <div className="grid gap-2">

                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={onFormChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input id="address" placeholder="123 Main St" value={formData.address} onChange={onFormChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="areaId">Khu vực hoạt động</Label>
                        <select
                            id="areaId"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            value={formData.areaId}
                            onChange={onFormChange}
                            disabled={areasLoading}
                        >
                            <option value={0} disabled>
                                {areasLoading ? "Đang tải..." : "Chọn khu vực"}
                            </option>
                            {areas?.map((area: AreaIdAndName) => (
                                <option key={area.areaId} value={area.areaId}>
                                    {area.areaName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

            <div className="flex justify-end">
                <Button type="button" className="w-32" onClick={onNext}>
                    Tiếp tục
                </Button>
            </div>
        </>
    )
}
