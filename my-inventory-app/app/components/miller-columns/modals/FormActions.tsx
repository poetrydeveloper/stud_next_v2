// components/miller-columns/modals/FormActions.tsx
'use client'

import { Loader2, Image as ImageIcon } from 'lucide-react'

interface FormActionsProps {
  loading: boolean
  onClose: () => void
}

export function FormActions({ loading, onClose }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4 border-t">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        disabled={loading}
      >
        Отмена
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Создание...</span>
          </>
        ) : (
          <>
            <ImageIcon size={16} />
            <span>Создать продукт</span>
          </>
        )}
      </button>
    </div>
  )
}