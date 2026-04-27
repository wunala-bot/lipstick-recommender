'use client'

import { useState, useCallback } from 'react'
import ImageUploader from '@/components/ImageUploader'
import BrandSelector from '@/components/BrandSelector'
import ResultDisplay from '@/components/ResultDisplay'
import LoadingState from '@/components/LoadingState'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{
    analysis: string
    recommendations: any[]
    infographicUrl: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = useCallback((imageData: string) => {
    setSelectedImage(imageData)
    setError(null)
  }, [])

  const handleBrandSelect = useCallback((brand: string) => {
    setSelectedBrand(brand)
    setError(null)
  }, [])

  const handleGenerate = async () => {
    if (!selectedImage || !selectedBrand) {
      setError('请上传照片并选择品牌')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          brand: selectedBrand
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '生成失败')
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || '生成过程中出现错误')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setSelectedBrand('')
    setResult(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent mb-2">
            💄 AI 口红推荐
          </h1>
          <p className="text-gray-600 text-sm">
            上传自拍，AI 为你定制专属色号
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Main Content */}
        {!result ? (
          <div className="space-y-6">
            {/* Image Upload */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">1. 上传你的照片</h2>
              <ImageUploader onImageSelect={handleImageSelect} selectedImage={selectedImage} />
            </section>

            {/* Brand Selection */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">2. 选择口红品牌</h2>
              <BrandSelector onBrandSelect={handleBrandSelect} selectedBrand={selectedBrand} />
            </section>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedImage || !selectedBrand}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              {isGenerating ? '生成中...' : '生成推荐报告'}
            </button>

            {/* Loading State */}
            {isGenerating && <LoadingState />}
          </div>
        ) : (
          <ResultDisplay 
            result={result} 
            onReset={handleReset}
            brand={selectedBrand}
          />
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-xs">
          <p>Powered by OpenAI GPT-4o & gpt-image-1</p>
        </footer>
      </div>
    </main>
  )
}
