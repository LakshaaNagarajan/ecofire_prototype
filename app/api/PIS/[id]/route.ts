<<<<<<<< Updated upstream:app/api/pis/[id]/route.ts
// route: /api/pis/:id
// description: Get PI by id
========
// app/api/PIS/[id]/route.ts
// description: Get, update, delete PI by id

>>>>>>>> Stashed changes:app/api/PIS/[id]/route.ts
import { NextResponse } from 'next/server';
import { PIService } from '@/lib/services/PI.service';
import { auth } from '@clerk/nextjs/server';

<<<<<<<< Updated upstream:app/api/pis/[id]/route.ts
const piService = new PIService();
========
const PIsService = new PIService();
>>>>>>>> Stashed changes:app/api/PIS/[id]/route.ts

export async function GET(
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
<<<<<<<< Updated upstream:app/api/pis/[id]/route.ts
    const pi = await piService.getPIById(params.id, userId);
  
    if (!pi) {
========
    const PI = await PIsService.getPIById(params.id, userId);
 
    if (!PI) {
>>>>>>>> Stashed changes:app/api/PIS/[id]/route.ts
      return NextResponse.json(
        {
          success: false,
          error: 'PI not found'
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
<<<<<<<< Updated upstream:app/api/pis/[id]/route.ts
      data: pi
    });
  } catch (error) {
    console.error(`Error in GET /api/pis/${params.id}:`, error);
========
      data: PI
    });
  } catch (error) {
    console.error(`Error in GET /api/PIS/${params.id}:`, error);
>>>>>>>> Stashed changes:app/api/PIS/[id]/route.ts
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const updateData = await request.json();
<<<<<<<< Updated upstream:app/api/pis/[id]/route.ts
    const updatedPI = await piService.updatePI(params.id, userId, updateData);

========
    const updatedPI = await PIsService.updatePI(params.id, userId, updateData);
>>>>>>>> Stashed changes:app/api/PIS/[id]/route.ts
    if (!updatedPI) {
      return NextResponse.json(
        {
          success: false,
          error: 'PI not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPI
    });
  } catch (error) {
<<<<<<<< Updated upstream:app/api/pis/[id]/route.ts
    console.error(`Error in PUT /api/pis/${params.id}:`, error);
========
    console.error(`Error in PUT /api/PIS/${params.id}:`, error);
>>>>>>>> Stashed changes:app/api/PIS/[id]/route.ts
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}

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
<<<<<<<< Updated upstream:app/api/pis/[id]/route.ts

    const deleted = await piService.deletePI(params.id, userId);

========
    const deleted = await PIsService.deletePI(params.id, userId);
>>>>>>>> Stashed changes:app/api/PIS/[id]/route.ts
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'PI not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'PI deleted successfully'
    });
  } catch (error) {
<<<<<<<< Updated upstream:app/api/pis/[id]/route.ts
    console.error(`Error in DELETE /api/pis/${params.id}:`, error);
========
    console.error(`Error in DELETE /api/PIS/${params.id}:`, error);
>>>>>>>> Stashed changes:app/api/PIS/[id]/route.ts
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}
