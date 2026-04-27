'use client'

import { useCallback } from 'react'

interface ImageUploaderProps {
  onImageSelect: (imageData: string) => void
  selectedImage: string | null
}

export default function ImageUploader({ onImageSelect, selectedImage }: ImageUploaderProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      onImageSelect(result)
    }
    reader.readAsDataURL(file)
  }, [onImageSelect])

  return (
    <div className="relative">
      {!selectedImage ? (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-rose-300 rounded-xl bg-rose-50/50 cursor-pointer hover:bg-rose-50 hover:border-rose-400 transition-all duration-200">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-12 h-12 text-rose-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <p className="text-sm text-gray-600 mb-1">点击上传自拍</p>
            <p className="text-xs text-gray-400">支持 JPG、PNG，最大 5MB</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="relative rounded-xl overflow-hidden">
          <img src={selectedImage} alt="Uploaded selfie" className="w-full h-64 object-cover rounded-xl" />
          <button
            onClick={() => onImageSelect('')}
            className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
