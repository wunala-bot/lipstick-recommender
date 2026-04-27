'use client'

interface BrandSelectorProps {
  onBrandSelect: (brand: string) => void
  selectedBrand: string
}

const BRANDS = [
  { id: 'dior', name: 'Dior 迪奥', color: 'from-gray-800 to-gray-900' },
  { id: 'chanel', name: 'Chanel 香奈儿', color: 'from-black to-gray-800' },
  { id: 'ysl', name: 'YSL 圣罗兰', color: 'from-yellow-600 to-yellow-700' },
  { id: 'mac', name: 'MAC 魅可', color: 'from-red-600 to-red-700' },
  { id: 'tomford', name: 'Tom Ford', color: 'from-amber-700 to-amber-800' },
  { id: 'armani', name: 'Armani 阿玛尼', color: 'from-blue-800 to-blue-900' },
  { id: 'lancome', name: 'Lancôme 兰蔻', color: 'from-rose-600 to-rose-700' },
  { id: 'gucci', name: 'Gucci 古驰', color: 'from-green-700 to-green-800' },
  { id: 'givenchy', name: 'Givenchy 纪梵希', color: 'from-purple-700 to-purple-800' },
  { id: 'charlottetilbury', name: 'Charlotte Tilbury', color: 'from-pink-500 to-rose-600' },
]

export default function BrandSelector({ onBrandSelect, selectedBrand }: BrandSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {BRANDS.map((brand) => (
        <button
          key={brand.id}
          onClick={() => onBrandSelect(brand.id)}
          className={`relative p-3 rounded-xl text-left transition-all duration-200 ${
            selectedBrand === brand.id
              ? 'ring-2 ring-rose-500 ring-offset-2 scale-[1.02] shadow-lg'
              : 'hover:scale-[1.02] shadow-md'
          }`}
        >
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${brand.color} opacity-90`} />
          <span className="relative text-white font-medium text-sm">{brand.name}</span>
        </button>
      ))}
    </div>
  )
}
