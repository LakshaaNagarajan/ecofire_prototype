"use client";
import { useEffect, useState } from "react";
import { Jobs } from "@/lib/models/job.model";
import { Job, columns } from "@/components/jobs/table/columns";
import { DataTable } from "@/components/jobs/table/jobs-table";

function convertJobsToTableData(jobs: Jobs[]): Job[] {
  return jobs.map(job => ({
    id: job._id,
    title: job.title,
    businessFunction: job.businessFunction || undefined,
    owner: job.owner || undefined,
    dueDate: job.dueDate || undefined // Keep as ISO string
  }));
}

export default function JobsPage() {
  const [data, setData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
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
    }

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}