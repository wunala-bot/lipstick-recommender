'use client'

export default function LoadingState() {
  return (
    <div className="mt-6 p-6 bg-white rounded-xl shadow-sm border border-rose-100 text-center">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 border-4 border-rose-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="text-gray-700 font-medium mb-1">AI 正在分析你的照片...</p>
      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
          分析肤色与气质
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          匹配品牌色号
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          生成推荐信息图
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4">大约需要 15-30 秒</p>
    </div>
  )
}
