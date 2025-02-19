"use client";
import { useEffect, useState } from "react";
import { Jobs } from "@/lib/models/job.model";
import { Job, columns } from "@/components/jobs/table/columns";
import { DataTable } from "@/components/jobs/table/jobs-table";
import { JobDialog } from "@/components/jobs/job-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function convertJobsToTableData(jobs: Jobs[]): Job[] {
  return jobs.map(job => ({
    id: job._id,
    title: job.title,
    businessFunction: job.businessFunction || undefined,
    owner: job.owner || undefined,
    dueDate: job.dueDate || undefined
  }));
}

export default function JobsPage() {
  const [data, setData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const result = await response.json();
      
      if (result.success) {
        const tableData = convertJobsToTableData(result.data);
        setData(tableData);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreate = async (jobData: Partial<Job>) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Job created successfully",
        });
        fetchJobs();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (jobData: Partial<Job>) => {
    if (!editingJob) return;

    try {
      const response = await fetch(`/api/jobs/${editingJob.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Job updated successfully",
        });
        fetchJobs();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Job deleted successfully",
        });
        fetchJobs();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setDialogOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingJob(undefined);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-lg">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Jobs</h1>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" /> Create Job
          </Button>
        </div>
        
        <DataTable 
          columns={columns(handleOpenEdit, handleDelete)} 
          data={data} 
        />

        <JobDialog
          mode={editingJob ? 'edit' : 'create'}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={editingJob ? handleEdit : handleCreate}
          initialData={editingJob}
        />
      </div>
    </div>
  );
}