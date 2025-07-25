"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import dynamic from "next/dynamic"
import type { TourGuideRegister } from "@/types/tour-guide"

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
})
import "react-quill-new/dist/quill.snow.css"
import { FormHeader } from "./form-header"

interface AdditionalInfoStepProps {
    formData: TourGuideRegister
    error: string
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onDescriptionChange: (value: string) => void
    onBack: () => void
    onSubmit: (e: React.FormEvent) => void
}

export function AdditionalInfoStep({
    formData,
    error,
    onFormChange,
    onDescriptionChange,
    onBack,
    onSubmit,
}: AdditionalInfoStepProps) {
    return (
        <>
            <FormHeader title="Tạo Tài Khoản" subtitle="Nhập thông tin của bạn bên dưới để tạo tài khoản." />
            <div className="grid gap-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin bổ sung</h3>
                <div className="grid gap-2">
                    <Label htmlFor="description">Mô tả bản thân</Label>
                    <ReactQuill
                        value={formData.description}
                        onChange={onDescriptionChange}
                        theme="snow"
                        placeholder="Giới thiệu bản thân"
                        style={{ minHeight: 100, marginBottom: 40 }}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin ngân hàng & kinh nghiệm</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="bankAccountNumber">Số tài khoản ngân hàng</Label>
                        <Input
                            id="bankAccountNumber"
                            type="text"
                            placeholder="Nhập số tài khoản"
                            value={formData.bankAccountNumber}
                            onChange={onFormChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bankName">Tên ngân hàng</Label>
                        <Input
                            id="bankName"
                            type="text"
                            placeholder="Nhập tên ngân hàng"
                            value={formData.bankName}
                            onChange={onFormChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="yearOfExperience">Số năm kinh nghiệm</Label>
                        <Input
                            id="yearOfExperience"
                            type="number"
                            min={0}
                            placeholder="0"
                            value={formData.yearOfExperience}
                            onChange={onFormChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="company">Công ty</Label>
                        <Input
                            id="company"
                            type="text"
                            placeholder="Tên công ty (nếu có)"
                            value={formData.company}
                            onChange={onFormChange}
                        />
                    </div>
                </div>
            </div>

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

            <div className="flex items-start gap-2">
                <div className="flex items-center h-5">
                    <input
                        id="terms"
                        type="checkbox"
                        className="w-4 h-4 border rounded bg-background border-input focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                    Tôi đồng ý với{" "}
                    <Link href="#" className="text-primary hover:underline">
                        các điều khoản và điều kiện
                    </Link>
                </label>
            </div>

            <div className="flex justify-between mt-2">
                <Button type="button" className="w-32 bg-transparent" variant="outline" onClick={onBack}>
                    Quay lại
                </Button>
                <Button type="submit" className="w-32 cursor-pointer" onClick={onSubmit}>
                    Đăng Ký
                </Button>
            </div>

            <div className="text-center text-sm mt-2">
                Đã có tài khoản?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-gray-600 transition">
                    Đăng Nhập
                </Link>
            </div>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"></div>

            <div className="text-balance text-center text-xs text-black [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-gray-600">
                Bằng cách nhấn Đăng ký, bạn đồng ý với các <Link href="#">Điều khoản Dịch vụ</Link> và{" "}
                <Link href="#">Chính sách Bảo mật</Link> của chúng tôi.
            </div>
        </>
    )
}
