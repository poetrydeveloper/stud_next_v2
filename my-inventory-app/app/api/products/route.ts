import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const name = formData.get('name') as string
    const code = formData.get('code') as string
    const description = formData.get('description') as string
    const files = formData.getAll('files') as File[]

    if (!name || !code) {
      return NextResponse.json({ error: 'Необходимо указать имя и код товара' }, { status: 400 })
    }

    // создаём товар
    const product = await prisma.product.create({
      data: {
        name,
        code,
        description,
      },
    })

    const uploadDir = process.env.UPLOAD_DIR || './public/img/products'
    const productDir = path.join(uploadDir, product.code)

    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true })
    }

    const savedFiles = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const bytes = Buffer.from(await file.arrayBuffer())
      const suffix = i === 0 ? 'main' : `${i + 1}`
      const filename = `${product.code}_${suffix}.jpg`
      const filepath = path.join(productDir, filename)

      fs.writeFileSync(filepath, bytes)

      const image = await prisma.productImage.create({
        data: {
          productId: product.id,
          filename,
          path: `img/products/${product.code}/${filename}`,
          isMain: i === 0,
        },
      })
      savedFiles.push(image)
    }

    return NextResponse.json({ success: true, product, images: savedFiles })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Ошибка создания товара' }, { status: 500 })
  }
}
