// route: /api/jobs
// description: Get all jobs

import { NextResponse } from 'next/server';
import { JobService } from '@/lib/services/job.service';

const jobService = new JobService();

export async function GET() {
  try {
    const jobs = await jobService.getAllJobs();
    
    return NextResponse.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal Server Error' 
      },
      { status: 500 }
    );
  }
}