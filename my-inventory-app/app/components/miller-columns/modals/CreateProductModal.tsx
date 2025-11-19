// components/miller-columns/modals/CreateProductModal.tsx
'use client'

import { useState, useEffect } from 'react'

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
  onProductCreated: (product: any) => void
  spineId?: number
  categoryId?: number
}

export default function CreateProductModal({ 
  isOpen, 
  onClose, 
  onProductCreated,
  spineId,
  categoryId 
}: CreateProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [showNewBrand, setShowNewBrand] = useState(false)
  const [showNewSupplier, setShowNewSupplier] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')
  const [newSupplierName, setNewSupplierName] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    brandId: '',
    supplierId: ''
  })

  console.log('🎯 CreateProductModal RENDERING!', {
    isOpen,
    spineId,
    categoryId
  })

  // Загружаем бренды и поставщиков
  useEffect(() => {
    if (isOpen) {
      fetchBrands()
      fetchSuppliers()
    }
  }, [isOpen])

  const fetchBrands = async () => {
    try {
      console.log('🎯 Fetching brands...')
      const response = await fetch('/api/brands')
      console.log('🎯 Brands response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('🎯 Brands result:', result)
        
        // Пробуем разные варианты структуры ответа
        let brandsData = []
        
        if (Array.isArray(result)) {
          brandsData = result
        } else if (Array.isArray(result.data)) {
          brandsData = result.data
        } else if (Array.isArray(result.brands)) {
          brandsData = result.brands
        } else if (result && typeof result === 'object') {
          // Если это объект, пробуем извлечь массив из свойств
          brandsData = Object.values(result)
        }
        
        console.log('🎯 Extracted brands data:', brandsData)
        
        if (Array.isArray(brandsData) && brandsData.length > 0) {
          setBrands(brandsData)
        } else {
          console.log('🎯 No brands found, using empty array')
          setBrands([])
        }
      } else {
        console.error('❌ Failed to fetch brands')
        setBrands([])
      }
    } catch (error) {
      console.error('❌ Error loading brands:', error)
      setBrands([])
    }
  }

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers')
      if (response.ok) {
        const result = await response.json()
        let suppliersData = []
        
        if (Array.isArray(result)) {
          suppliersData = result
        } else if (Array.isArray(result.data)) {
          suppliersData = result.data
        } else if (Array.isArray(result.suppliers)) {
          suppliersData = result.suppliers
        }
        
        setSuppliers(suppliersData || [])
      }
    } catch (error) {
      console.error('Error loading suppliers:', error)
      setSuppliers([])
    }
  }

  const createNewBrand = async () => {
    if (!newBrandName.trim()) {
      alert('Введите название бренда')
      return
    }

    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newBrandName })
      })

      if (response.ok) {
        const newBrand = await response.json()
        setBrands(prev => [...prev, newBrand.data || newBrand])
        setFormData(prev => ({ ...prev, brandId: (newBrand.data?.id || newBrand.id).toString() }))
        setNewBrandName('')
        setShowNewBrand(false)
      } else {
        alert('Ошибка при создании бренда')
      }
    } catch (error) {
      console.error('Error creating brand:', error)
      alert('Ошибка при создании бренда')
    }
  }

  const createNewSupplier = async () => {
    if (!newSupplierName.trim()) {
      alert('Введите название поставщика')
      return
    }

    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newSupplierName })
      })

      if (response.ok) {
        const newSupplier = await response.json()
        setSuppliers(prev => [...prev, newSupplier.data || newSupplier])
        setFormData(prev => ({ ...prev, supplierId: (newSupplier.data?.id || newSupplier.id).toString() }))
        setNewSupplierName('')
        setShowNewSupplier(false)
      } else {
        alert('Ошибка при создании поставщика')
      }
    } catch (error) {
      console.error('Error creating supplier:', error)
      alert('Ошибка при создании поставщика')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🎯 Submitting product form...', formData)
    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('code', formData.code)
      submitData.append('description', formData.description)
      submitData.append('brandId', formData.brandId)
      
      if (formData.supplierId) {
        submitData.append('supplierId', formData.supplierId)
      }
      
      if (spineId) {
        submitData.append('spineId', spineId.toString())
      }
      
      if (categoryId) {
        submitData.append('categoryId', categoryId.toString())
      }

      console.log('🎯 Sending FormData to /api/products...')
      const response = await fetch('/api/products', { 
        method: 'POST',
        body: submitData
      })
      
      console.log('🎯 Response status:', response.status)
      const result = await response.json()
      console.log('🎯 Response result:', result)

      if (response.ok && result.ok) {
        console.log('✅ Product created successfully:', result.data)
        onProductCreated(result.data)
        handleClose()
      } else {
        console.error('❌ Error creating product:', result.error)
        alert(result.error || 'Failed to create product')
      }
    } catch (error) {
      console.error('❌ Network error creating product:', error)
      alert('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    console.log('🎯 Closing product modal')
    setFormData({
      name: '',
      code: '',
      description: '',
      brandId: '',
      supplierId: ''
    })
    setNewBrandName('')
    setNewSupplierName('')
    setShowNewBrand(false)
    setShowNewSupplier(false)
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) {
    console.log('🎯 Modal not open, skipping render')
    return null
  }

  console.log('🎯 Rendering CreateProductModal UI')

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '95%',
        maxWidth: '600px',
        maxHeight: '95vh',
        overflow: 'auto',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '16px'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Создать новый товар
          </h2>
          <button 
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Название товара *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
              placeholder="Введите название товара"
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Артикул (SKU) *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
              placeholder="Введите артикул"
              required
            />
          </div>

          {/* Бренд с возможностью создания нового */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ 
                fontWeight: '500',
                color: '#374151'
              }}>
                Бренд *
              </label>
              <button
                type="button"
                onClick={() => setShowNewBrand(!showNewBrand)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {showNewBrand ? '← Выбрать из списка' : '+ Создать новый'}
              </button>
            </div>

            {!showNewBrand ? (
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                required
              >
                <option value="">Выберите бренд</option>
                {Array.isArray(brands) && brands.map((brand: any) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                  placeholder="Введите название нового бренда"
                />
                <button
                  type="button"
                  onClick={createNewBrand}
                  style={{
                    padding: '10px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Создать
                </button>
              </div>
            )}
          </div>

          {/* Поставщик с возможностью создания нового */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ 
                fontWeight: '500',
                color: '#374151'
              }}>
                Поставщик
              </label>
              <button
                type="button"
                onClick={() => setShowNewSupplier(!showNewSupplier)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {showNewSupplier ? '← Выбрать из списка' : '+ Создать нового'}
              </button>
            </div>

            {!showNewSupplier ? (
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Выберите поставщика (опционально)</option>
                {Array.isArray(suppliers) && suppliers.map((supplier: any) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                  placeholder="Введите название нового поставщика"
                />
                <button
                  type="button"
                  onClick={createNewSupplier}
                  style={{
                    padding: '10px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Создать
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                minHeight: '80px',
                resize: 'vertical'
              }}
              placeholder="Введите описание товара"
            />
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '12px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '10px 20px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Создание...' : 'Создать товар'}
            </button>
          </div>
        </form>

        {/* Дебаг-информация */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6c757d',
          border: '1px solid #e9ecef'
        }}>
          <div><strong>Debug Info:</strong></div>
          <div>Spine ID: {spineId || 'undefined'}</div>
          <div>Category ID: {categoryId || 'undefined'}</div>
          <div>Brands: {Array.isArray(brands) ? brands.length : 'NOT ARRAY'}</div>
          <div>Suppliers: {Array.isArray(suppliers) ? suppliers.length : 'NOT ARRAY'}</div>
        </div>
      </div>
    </div>
  )
}