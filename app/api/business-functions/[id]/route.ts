import { NextResponse } from 'next/server';
import { BusinessFunctionService } from '@/lib/services/business-function.service';
import { auth } from '@clerk/nextjs/server';

const businessFunctionService = new BusinessFunctionService();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const deleted = await businessFunctionService.deleteBusinessFunction(
      params.id, 
      userId
    );

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Business function not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Business function deleted successfully'
    });
  } catch (error: any) {
    console.error(`Error in DELETE /api/business-functions/${params.id}:`, error);
    
    if (error.message === 'Cannot delete default business function') {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete default business function'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}