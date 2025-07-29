"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface ImageUploadProps {
  label: string
  imageUrl: string | null
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  isProfile?: boolean,
}

export function ImageUpload({ label, imageUrl, onImageUpload, className = "", isProfile = false }: ImageUploadProps) {
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative w-full flex justify-center">
        <div
          className={`
          ${isProfile ? "w-24 h-24 rounded-full" : "w-full max-w-xl h-32 rounded-lg"} 
          border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden
        `}
        >
          {imageUrl ? (
            <img src={imageUrl || "/placeholder.svg"} alt={label} className="w-full h-full object-cover" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <p className="text-xs text-gray-500 text-center">Bấm hoặc kéo thả để tải ảnh lên. SVG, PNG, JPG, JPEG</p>
    </div>
  )
}
