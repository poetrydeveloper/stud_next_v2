// components/miller-columns/modals/FormFields.tsx
'use client'

import { Loader2 } from 'lucide-react'

interface FormFieldsProps {
  formData: any
  setFormData: (data: any) => void
  brands: any[]
  spines: any[]
  brandsLoading: boolean
  spinesLoading: boolean
  spineId?: number
}

export function FormFields({
  formData,
  setFormData,
  brands,
  spines,
  brandsLoading,
  spinesLoading,
  spineId
}: FormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        label="Код продукта *"
        type="text"
        value={formData.code}
        onChange={(value: string) => setFormData({ ...formData, code: value })}
        placeholder="Например: ART-001"
        required
      />

      <FormField
        label="Название продукта *"
        type="text"
        value={formData.name}
        onChange={(value: string) => setFormData({ ...formData, name: value })}
        placeholder="Например: Набор бит 50 предметов"
        required
      />

      <BrandSelect 
        brands={brands}
        loading={brandsLoading}
        value={formData.brandId}
        onChange={(value: string) => setFormData({ ...formData, brandId: value })}
      />

      <SpineSelect 
        spines={spines}
        loading={spinesLoading}
        value={formData.spineId}
        spineId={spineId}
        onChange={(value: string) => setFormData({ ...formData, spineId: value })}
      />
    </div>
  )
}

function FormField({ label, type, value, onChange, placeholder, required }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
    </div>
  )
}

function BrandSelect({ brands, loading, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Бренд *
      </label>
      {loading ? (
        <div className="flex items-center space-x-2">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm text-gray-500">Загрузка брендов...</span>
        </div>
      ) : (
        <select
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Выберите бренд</option>
          {Array.isArray(brands) && brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

function SpineSelect({ spines, loading, value, spineId, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Spine *
      </label>
      {loading ? (
        <div className="flex items-center space-x-2">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm text-gray-500">Загрузка spines...</span>
        </div>
      ) : (
        <select
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={!!spineId}
        >
          <option value="">Выберите spine</option>
          {Array.isArray(spines) && spines.map((spine) => (
            <option key={spine.id} value={spine.id}>
              {spine.name} {spine.human_path && `(${spine.human_path})`}
            </option>
          ))}
        </select>
      )}
      {spineId && (
        <p className="text-xs text-gray-500 mt-1">
          Spine предварительно выбран из навигации
        </p>
      )}
    </div>
  )
}