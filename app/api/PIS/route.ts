<<<<<<<< Updated upstream:app/api/pis/route.ts
// route: /api/pis
// description: Get all PIs
========
// app/api/PIs/route.ts
// description: Get all PIs

>>>>>>>> Stashed changes:app/api/PIS/route.ts
import { NextResponse } from 'next/server';
import { PIService } from '@/lib/services/PI.service';
import { auth } from '@clerk/nextjs/server';

<<<<<<<< Updated upstream:app/api/pis/route.ts
const piService = new PIService();
========
const PIsService = new PIService();
>>>>>>>> Stashed changes:app/api/PIS/route.ts

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
<<<<<<<< Updated upstream:app/api/pis/route.ts
    const pis = await piService.getAllPIs(userId);
   
    return NextResponse.json({
      success: true,
      count: pis.length,
      data: pis
    });
  } catch (error) {
    console.error('Error in GET /api/pis:', error);
========
    const PIs = await PIsService.getAllPIs(userId);
   
    return NextResponse.json({
      success: true,
      count: PIs.length,
      data: PIs
    });
  } catch (error) {
    console.error('Error in GET /api/PIS:', error);
>>>>>>>> Stashed changes:app/api/PIS/route.ts
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
<<<<<<<< Updated upstream:app/api/pis/route.ts

    const piData = await request.json();
    const pi = await piService.createPI(piData, userId);

    return NextResponse.json({
      success: true,
      data: pi
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/pis:', error);
========
    const PIData = await request.json();
    const PI = await PIsService.createPI(PIData, userId);
    return NextResponse.json({
      success: true,
      data: PI
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/PIS:', error);
>>>>>>>> Stashed changes:app/api/PIS/route.ts
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}
