// components/miller-columns/modals/hooks/useProductData.ts
'use client'

import { useState } from 'react'

interface Brand {
  id: number
  name: string
}

interface Spine {
  id: number
  name: string
  node_index?: string
  human_path?: string
}

export function useProductData() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [spines, setSpines] = useState<Spine[]>([])
  const [brandsLoading, setBrandsLoading] = useState(true)
  const [spinesLoading, setSpinesLoading] = useState(true)

  const fetchData = async (categoryId?: number, spineId?: number, formData?: any, setFormData?: any) => {
    await Promise.all([fetchBrands(), fetchSpines(categoryId, spineId, formData, setFormData)])
  }

  const fetchBrands = async () => {
    try {
      setBrandsLoading(true)
      const response = await fetch('/api/brands')
      const result = await response.json()
      
      if (result.ok && Array.isArray(result.data)) {
        setBrands(result.data)
      } else {
        setBrands([])
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
      setBrands([])
    } finally {
      setBrandsLoading(false)
    }
  }

  const fetchSpines = async (categoryId?: number, spineId?: number, formData?: any, setFormData?: any) => {
    try {
      setSpinesLoading(true)
      let url = '/api/spines/simple'
      if (categoryId) url += `?categoryId=${categoryId}`
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.ok && Array.isArray(result.data)) {
        setSpines(result.data)
        if (spineId && !formData?.spineId && setFormData) {
          setFormData((prev: any) => ({ ...prev, spineId: spineId.toString() }))
        }
      } else {
        setSpines([])
      }
    } catch (error) {
      console.error('Error fetching spines:', error)
      setSpines([])
    } finally {
      setSpinesLoading(false)
    }
  }

  return {
    brands,
    spines,
    brandsLoading,
    spinesLoading,
    fetchData
  }
}