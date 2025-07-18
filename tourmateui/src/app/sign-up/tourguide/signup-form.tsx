"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { fetchAreaIdAndName } from "@/api/active-area.api"
import type { ApiError } from "@/types/response"
import { storage } from "../../../../firebaseConfig"
import type { TourGuideRegister } from "@/types/tour-guide"
import { registerTourGuide } from "@/api/account.api"
import { PersonalInfoStep } from "./personal-info-step"
import { AdditionalInfoStep } from "./additional-info-step"

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [formData, setFormData] = useState<TourGuideRegister>({
    email: "",
    password: "",
    fullName: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    image: "",
    phone: "",
    bannerImage: "",
    bankAccountNumber: "",
    bankName: "",
    yearOfExperience: 0,
    description: "",
    company: "",
    areaId: 0,
  })
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  const mutation = useMutation({
    mutationFn: (data: TourGuideRegister) => registerTourGuide(data),
    onSuccess: (response: { msg: string }) => {
      alert(response.msg)
      setTimeout(() => {
        window.location.href = "/login"
      }, 800)
    },
    onError: (error: ApiError) => {
      setError(error.response?.data?.msg || "Đăng ký thất bại. Vui lòng thử lại sau.")
    },
  })

  const areasMutation = useMutation({
    mutationFn: fetchAreaIdAndName,
    onError: (error: ApiError) => {
      console.error("Error fetching areas:", error)
      setError("Không thể tải danh sách khu vực. Vui lòng thử lại sau.")
    },
  })

  useEffect(() => {
    areasMutation.mutate()
  }, [])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const storageRef = ref(storage, `tour-guides/profile-images/${Date.now()}-${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      setProfileImage(downloadURL)
      setFormData((prev) => ({
        ...prev,
        image: downloadURL,
      }))
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Tải ảnh lên thất bại. Vui lòng thử lại.")
    }
  }

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const storageRef = ref(storage, `tour-guides/banner-images/${Date.now()}-${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      setFormData((prev) => ({
        ...prev,
        bannerImage: downloadURL,
      }))
    } catch (error) {
      console.error("Error uploading banner image:", error)
      alert("Tải ảnh banner lên thất bại. Vui lòng thử lại.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: id === "areaId" ? Number(value) : value,
    })
  }

  const handleDescriptionChange = (value: string) => {
    const cleanText = value.trim()
    setFormData((prev) => ({
      ...prev,
      description: cleanText,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.areaId === 0) {
      setError("Vui lòng chọn khu vực hoạt động.")
      return
    }
    mutation.mutate(formData)
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      {step === 1 && (
        <PersonalInfoStep
          formData={formData}
          error={error}
          profileImage={profileImage}
          areas={areasMutation.data}
          areasLoading={areasMutation.isPending}
          onFormChange={handleChange}
          onProfileImageUpload={handleImageUpload}
          onBannerImageUpload={handleBannerUpload}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <AdditionalInfoStep
          formData={formData}
          error={error}
          onFormChange={handleChange}
          onDescriptionChange={handleDescriptionChange}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}
    </form>
  )
}
