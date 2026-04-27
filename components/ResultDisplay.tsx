'use client'

interface ResultDisplayProps {
  result: {
    analysis: string
    recommendations: any[]
    infographicUrl: string
  }
  onReset: () => void
  brand: string
}

export default function ResultDisplay({ result, onReset, brand }: ResultDisplayProps) {
  const handleSave = () => {
    const link = document.createElement('a')
    link.href = result.infographicUrl
    link.download = `lipstick-recommendation-${brand}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(result.infographicUrl)
        const blob = await response.blob()
        const file = new File([blob], 'lipstick-recommendation.png', { type: 'image/png' })
        await navigator.share({
          title: '我的 AI 口红推荐',
          text: result.analysis,
          files: [file]
        })
      } catch (err) {
        console.log('Share cancelled or failed')
      }
    } else {
      // Fallback: copy image URL
      navigator.clipboard.writeText(result.infographicUrl)
      alert('图片链接已复制到剪贴板')
    }
  }

  return (
    <div className="space-y-6">
      {/* Analysis Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
        <h3 className="font-semibold text-gray-800 mb-2">💡 分析结果</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{result.analysis}</p>
      </div>

      {/* Infographic */}
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img 
          src={result.infographicUrl} 
          alt="口红推荐信息图" 
          className="w-full"
        />
      </div>

      {/* Recommendations List */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
        <h3 className="font-semibold text-gray-800 mb-3">🎨 推荐色号</h3>
        <div className="space-y-3">
          {result.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: rec.color || '#e11d48' }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{rec.number}</span>
                  <span className="text-sm text-gray-500">{rec.name}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{rec.effect} · {rec.scene}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleSave}
          className="py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l3-3m-3 3H21" />
          </svg>
          保存到相册
        </button>
        <button
          onClick={handleShare}
          className="py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-7.5l9.566-5.314m0 7.5l-9.566 5.314" />
          </svg>
          分享
        </button>
      </div>

      {/* Try Again */}
      <button
        onClick={onReset}
        className="w-full py-3 border-2 border-rose-200 text-rose-600 font-semibold rounded-xl hover:bg-rose-50 transition-colors"
      >
        再试一次
      </button>
    </div>
  )
}
