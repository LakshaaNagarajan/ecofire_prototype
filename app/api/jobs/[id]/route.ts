// route: /api/jobs/:id


import { NextResponse } from 'next/server';
import { JobService } from '@/lib/services/job.service';

const jobService = new JobService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await jobService.getJobById(params.id);
    
    if (!job) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Job not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error(`Error in GET /api/jobs/${params.id}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal Server Error' 
      },
      { status: 500 }
    );
  }
}
