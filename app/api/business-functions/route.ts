import { NextResponse } from 'next/server';
import { BusinessFunctionService } from '@/lib/services/business-function.service';
import { auth } from '@clerk/nextjs/server';

const businessFunctionService = new BusinessFunctionService();

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

    const functions = await businessFunctionService.getAllBusinessFunctions(userId);
   
    return NextResponse.json({
      success: true,
      count: functions.length,
      data: functions
    });
  } catch (error) {
    console.error('Error in GET /api/business-functions:', error);
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

    const { name } = await request.json();
    const businessFunction = await businessFunctionService.createBusinessFunction(
      name, 
      userId
    );

    return NextResponse.json({
      success: true,
      data: businessFunction
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/business-functions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}