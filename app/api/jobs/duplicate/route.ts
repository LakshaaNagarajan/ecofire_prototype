
// route: /api/jobs/duplicate
// description: API endpoint for duplicating a job with all its tasks and mappings
import { NextResponse } from 'next/server';
import { JobService } from '@/lib/services/job.service';
import { validateAuth } from '@/lib/utils/auth-utils';
import { Task } from '@/lib/models/task.model';
import { Jobs } from '@/lib/models/job.model';

const jobService = new JobService();

export async function POST(request: Request) {
  try {
    // Validate authentication
    const authResult = await validateAuth();
    
    if (!authResult.isAuthorized) {
      return authResult.response;
    }
    
    const userId = authResult.userId;
    
    // Parse request body
    const { sourceJobId, newJobData } = await request.json();
    
    if (!sourceJobId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Source job ID is required'
        },
        { status: 400 }
      );
    }
    
    // Get the source job
    const sourceJob = await jobService.getJobById(sourceJobId, userId!);
    
    if (!sourceJob) {
      return NextResponse.json(
        {
          success: false,
          error: 'Source job not found'
        },
        { status: 404 }
      );
    }
    
    // Create the duplicated job
    const jobResponse = await jobService.createJob({
      ...newJobData,
      tasks: [],
      nextTaskId: undefined
    }, userId!);
    
    const newJobId = jobResponse._id;
    const newJobTitle = jobResponse.title;
    
    // Fetch tasks of the original job
    const { TaskService } = await import('@/lib/services/task.service');
    const taskService = new TaskService();
    const tasksResult = await taskService.getTasksByJobId(sourceJobId);
    
    if (tasksResult && tasksResult.length > 0) {
      // Keep track of newly created tasks
      const newTasksMap: Record<string, string> = {}; // Maps original task titles to new task IDs
      const newTaskIds: string[] = []; // Array to store all new task IDs
      
      // Create new tasks for the duplicated job
      for (const task of tasksResult) {
        // Prepare the new task data
        const newTask = {
          ...task,
          jobId: newJobId,
          completed: false,
        };
        delete newTask._id;
        delete newTask.id;
        
        // Create the task
        const taskResult = await taskService.createTask(newTask, userId!);
        
        if (taskResult) {
          // Store the new task ID with its title as key
          newTasksMap[task.title] = taskResult._id;
          newTaskIds.push(taskResult._id);
        }
      }
      
      // Update the job with the list of new task IDs
      await jobService.updateJob(newJobId, userId!, { tasks: newTaskIds });
      
      // If the source job has a next task, find the corresponding task in the new job
      if (sourceJob.nextTaskId) {
        // Find the title of the next task in the original job
        const nextTaskDetails = tasksResult.find(
          (task: Task) =>
            task.id === sourceJob.nextTaskId ||
            task._id === sourceJob.nextTaskId
        );
        
        if (nextTaskDetails && newTasksMap[nextTaskDetails.title]) {
          // Set the nextTaskId of the new job
          await jobService.updateJob(newJobId, userId!, {
            nextTaskId: newTasksMap[nextTaskDetails.title]
          });
        }
      }
      
      // Set first task as nextTaskId if none is set
      await jobService.setFirstTaskAsNextTaskId(newJobId);
    }
    
    // Duplicate PI-job mappings
    try {
      const { PIJobMappingService } = await import('@/lib/services/pi-job-mapping.service');
      const mappingService = new PIJobMappingService();
      
      // Fetch all PI-job mappings to find those associated with the original job
      const originalJobMappings = await mappingService.getMappingsByJobId(sourceJobId);
      
      // Create new mappings for each original mapping
      if (originalJobMappings && originalJobMappings.length > 0) {
        for (const mapping of originalJobMappings) {
          // Prepare the new mapping data
          const newMapping = {
            jobId: newJobId,
            jobName: newJobTitle,
            piId: mapping.piId,
            piName: mapping.piName,
            piImpactValue: mapping.piImpactValue,
            piTarget: mapping.piTarget || 0,
            notes: `Duplicated from job: ${sourceJob.title}`,
          };
          
          // Create the mapping
          await mappingService.createMapping(newMapping, userId!);
        }
      }
    } catch (error) {
      console.error("Error duplicating PI-job mappings:", error);
      // Continue execution even if mapping duplication fails
    }
    
    // Update job impact values
    try {
      const { updateJobImpactValues } = await import('@/lib/services/job-impact.service');
      await updateJobImpactValues(userId!);
    } catch (error) {
      console.error("Error updating job impact values:", error);
    }
    
    return NextResponse.json({
      success: true,
      data: jobResponse
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/jobs/duplicate:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}
