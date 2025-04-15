"use client";

import { useState, useEffect } from "react";
import { QBOs } from "@/lib/models/qbo.model";
import { Jobs } from "@/lib/models/job.model";
import { Card } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface QBOCircleProps {
  onSelectJob?: (jobId: string) => void;
}

export function QBOCircles({ onSelectJob }: QBOCircleProps) {
  const [qbos, setQbos] = useState<QBOs[]>([]);
  const [qboJobsMap, setQboJobsMap] = useState<Record<string, Jobs[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQbosAndMappings = async () => {
      try {
        setLoading(true);

        // Fetch all QBOs
        const qboResponse = await fetch("/api/qbos");
        const qboResult = await qboResponse.json();

        if (!qboResult.success) {
          throw new Error("Failed to fetch QBOs");
        }

        const qbosData = qboResult.data;
        setQbos(qbosData);

        // Fetch job mappings for each QBO
        const jobMappingsPromises = qbosData.map(async (qbo: QBOs) => {
          const response = await fetch(
            `/api/qbo-job-mappings?qboId=${qbo._id}`,
          );
          const result = await response.json();

          if (result.success) {
            return { qboId: qbo._id, jobs: result.data };
          }
          return { qboId: qbo._id, jobs: [] };
        });

        const jobMappingsResults = await Promise.all(jobMappingsPromises);

        // Create map of QBO ID to associated jobs
        const qboToJobsMap: Record<string, Jobs[]> = {};
        jobMappingsResults.forEach((result) => {
          qboToJobsMap[result.qboId] = result.jobs;
        });

        setQboJobsMap(qboToJobsMap);
      } catch (error) {
        console.error("Error fetching QBOs and job mappings:", error);
        toast({
          title: "Error",
          description: "Failed to load QBO and job data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQbosAndMappings();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">Loading QBO mappings...</div>
    );
  }

  if (qbos.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No QBOs found.
      </div>
    );
  }

  // Helper function to get a color based on the QBO name (for consistent colors per QBO)
  const getQboColor = (qboName: string) => {
    const colors = [
      "bg-blue-100 border-blue-500 text-blue-800",
      "bg-green-100 border-green-500 text-green-800",
      "bg-purple-100 border-purple-500 text-purple-800",
      "bg-amber-100 border-amber-500 text-amber-800",
      "bg-rose-100 border-rose-500 text-rose-800",
      "bg-cyan-100 border-cyan-500 text-cyan-800",
    ];

    // Simple hash function to ensure same QBO always gets same color
    const hash = qboName
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % colors.length;

    return colors[colorIndex];
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">QBO Job Mappings</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {qbos.map((qbo) => {
          const jobs = qboJobsMap[qbo._id] || [];
          const colorClass = getQboColor(qbo.name);

          return (
            <TooltipProvider key={qbo._id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card
                    className={`flex flex-col items-center justify-center p-4 rounded-full border-2 ${colorClass} cursor-pointer transition-transform hover:scale-105 min-w-[200px] min-h-[200px] max-w-[300px] max-h-[300px] overflow-hidden`}
                  >
                    <div className="font-bold text-center mb-2">{qbo.name}</div>
                    <div className="mt-2 w-full overflow-y-auto max-h-[150px] text-center">
                      {jobs.length === 0 ? (
                        <div className="text-xs italic">No jobs mapped</div>
                      ) : (
                        <ul className="text-xs">
                          {jobs.map((job) => (
                            <li
                              key={job._id}
                              className="mb-1 truncate hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectJob) onSelectJob(job._id);
                              }}
                            >
                              {job.title}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{qbo.name}</p>
                  <p className="text-sm">{jobs.length} jobs mapped</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}
