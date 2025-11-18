export const apiService = {
  async createCategory(name: string, parentId?: number): Promise<any> {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        parentId: parentId || null,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create category')
    }

    return await response.json()
  },

  async createSpine(name: string, categoryId: number): Promise<any> {
    const response = await fetch('/api/spines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        categoryId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create spine')
    }

    return await response.json()
  },

  async createProduct(formData: FormData): Promise<any> {
    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    
    if (!response.ok || !result.ok) {
      throw new Error(result.error || 'Failed to create product')
    }

    return result
  }
}