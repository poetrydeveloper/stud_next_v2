//app/api/product/]id]/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Файлы не загружены' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ 
      where: { id: Number(params.id) } 
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Продукт не найден' }, { status: 404 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'img', 'products', product.code)
    
    // Создаём папку асинхронно
    await mkdir(uploadDir, { recursive: true })

    const savedFiles = []
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Проверка типа файла
      if (!allowedMimeTypes.includes(file.type)) {
        continue // Пропускаем не-изображения
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const suffix = i === 0 ? 'main' : `${i + 1}`
      const filename = `${product.code}_${suffix}.jpg`
      const filepath = path.join(uploadDir, filename)

      // Асинхронная запись файла
      await writeFile(filepath, buffer)

      const image = await prisma.productImage.create({
        data: {
          productId: product.id,
          filename,
          path: `/img/products/${product.code}/${filename}`,
          isMain: i === 0,
        },
      })

      savedFiles.push(image)
    }

    return NextResponse.json({ success: true, files: savedFiles })
  } catch (err) {
    console.error('Ошибка загрузки файлов:', err)
    return NextResponse.json({ error: 'Ошибка загрузки файлов' }, { status: 500 })
  }
}