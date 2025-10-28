import { NextRequest, NextResponse } from 'next/server'
import { StockTrafficLightService } from '@/lib/stock-traffic-light-service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const forceRefresh = searchParams.get('force') === 'true'
    
    const service = new StockTrafficLightService()
    const data = await service.getVisualizationData(forceRefresh)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Visual dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visualization data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productCode, brandName } = await request.json()
    const service = new StockTrafficLightService()
    await service.addToCandidates(productCode, brandName)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Add to candidates error:', error)
    return NextResponse.json(
      { error: 'Failed to add to candidates' },
      { status: 500 }
    )
  }
}