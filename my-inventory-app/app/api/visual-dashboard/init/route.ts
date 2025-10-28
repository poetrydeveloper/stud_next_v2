import { NextResponse } from 'next/server'
import { StockTrafficLightService } from '@/lib/stock-traffic-light-service'

export async function POST() {
  try {
    const service = new StockTrafficLightService()
    await service.initializeTrafficLights()
    
    return NextResponse.json({ 
      success: true,
      message: 'Traffic lights initialized successfully'
    })
  } catch (error) {
    console.error('Traffic lights initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize traffic lights' },
      { status: 500 }
    )
  }
}