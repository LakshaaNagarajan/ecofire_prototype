'use client';

import { useEffect, useState } from 'react';
import { Jobs } from '@/lib/models/job.model';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs');
        const data = await response.json();
        
        if (data.success) {
          setJobs(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Jobs List</h1>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p>Owner: {job.owner}</p>
            <p>Business Function: {job.businessFunction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}