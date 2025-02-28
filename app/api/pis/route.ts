// route: /api/pis
// description: Get all PIs
import { NextResponse } from 'next/server';
import { PIService } from '@/lib/services/PI.service';
import { auth } from '@clerk/nextjs/server';

const piService = new PIService();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      );
    }
    const pis = await piService.getAllPIs(userId);
   
    return NextResponse.json({
      success: true,
      count: pis.length,
      data: pis
    });
  } catch (error) {
    console.error('Error in GET /api/pis:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      );
    }

    const piData = await request.json();
    const pi = await piService.createPI(piData, userId);

    return NextResponse.json({
      success: true,
      data: pi
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/pis:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}
