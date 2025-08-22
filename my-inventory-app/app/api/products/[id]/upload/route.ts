import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Файлы не загружены' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: Number(params.id) } })
    if (!product) {
      return NextResponse.json({ error: 'Продукт не найден' }, { status: 404 })
    }

    const uploadDir = process.env.UPLOAD_DIR || './public/img/products'
    const productDir = path.join(uploadDir, product.code)

    // создаём папку для товара, если нет
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true })
    }

    const savedFiles = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const bytes = Buffer.from(await file.arrayBuffer())

      // имя файла: rf-75510_main.jpg или rf-75510_2.jpg
      const suffix = i === 0 ? 'main' : `${i + 1}`
      const filename = `${product.code}_${suffix}.jpg`
      const filepath = path.join(productDir, filename)

      fs.writeFileSync(filepath, bytes)

      // сохраняем в БД
      const image = await prisma.productImage.create({
        data: {
          productId: product.id,
          filename,
          path: `img/products/${product.code}/${filename}`,
          isMain: i === 0, // первая — главная
        },
      })

      savedFiles.push(image)
    }

    return NextResponse.json({ success: true, files: savedFiles })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Ошибка загрузки файлов' }, { status: 500 })
  }
}
