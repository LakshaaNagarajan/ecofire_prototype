import Job from '../models/job.model';
import { Jobs } from '../models/job.model';
import dbConnect from '../mongodb';

export class JobService {
  async getAllJobs(): Promise<Jobs[]> {
    try {
      await dbConnect();
      const jobs = await Job.find({}).lean();
      return JSON.parse(JSON.stringify(jobs));
    } catch (error) {
      throw new Error('Error fetching jobs from database');
    }
  }

  async getJobById(id: string): Promise<Jobs | null> {
    try {
      await dbConnect();
      const job = await Job.findById(id).lean();
      return job ? JSON.parse(JSON.stringify(job)) : null;
    } catch (error) {
      throw new Error('Error fetching job from database');
    }
  }
}