// app/api/cron/close-cash-days/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Вызываем API для закрытия просроченных кассовых дней
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/cash-days/close-expired`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to close expired cash days');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: result.message,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка выполнения cron job',
        detail: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}