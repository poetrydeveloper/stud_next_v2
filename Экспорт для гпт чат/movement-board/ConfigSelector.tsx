// components/movement-board/ConfigSelector.tsx
'use client'

import { useCalendarConfig, ConfigPreset } from './hooks/useCalendarConfig'

interface ConfigSelectorProps {
  onConfigChange?: (preset: ConfigPreset) => void
}

export default function ConfigSelector({ onConfigChange }: ConfigSelectorProps) {
  const { currentPreset, switchConfig, availablePresets } = useCalendarConfig()

  const handleConfigChange = (preset: ConfigPreset) => {
    switchConfig(preset)
    onConfigChange?.(preset)
  }

  const presetLabels: Record<ConfigPreset, string> = {
    classic: 'Классический',
    vertical: 'Вертикальный',
    compact: 'Компактный'
  }

  const presetIcons: Record<ConfigPreset, string> = {
    classic: '📅',
    vertical: '📊',
    compact: '🔍'
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
      {availablePresets.map(preset => (
        <button
          key={preset}
          onClick={() => handleConfigChange(preset)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            currentPreset === preset
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
          }`}
          title={presetLabels[preset]}
        >
          <span>{presetIcons[preset]}</span>
          <span className="hidden sm:inline">{presetLabels[preset]}</span>
        </button>
      ))}
    </div>
  )
}