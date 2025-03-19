"use client";

import { useMemo } from "react";
import { Task } from "../types";
import { TaskCard } from "../tasks-card";

interface TaskCardsProps {
  data: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string, completed: boolean) => void;
  ownerMap: Record<string, string>;
}

export function TaskCards({
  data,
  onEdit,
  onDelete,
  onComplete,
  ownerMap
}: TaskCardsProps) {
  // Sort data to push completed tasks to the bottom and next task to the top
  const sortedData = useMemo(() => {
    // Create a new array to avoid mutating the original data
    return [...data].sort((a, b) => {
      // First, sort by completion status
      const aCompleted = !!a.completed;
      const bCompleted = !!b.completed;
      
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }
      
      // If both have the same completion status, sort by next task status
      const aIsNextTask = !!a.isNextTask;
      const bIsNextTask = !!b.isNextTask;
      
      if (aIsNextTask !== bIsNextTask) {
        return aIsNextTask ? -1 : 1;
      }
      
      // If both have the same completion and next task status, keep original order
      return 0;
    });
  }, [data]);

  if (!sortedData.length) {
    return (
      <div className="p-8 text-center text-gray-500 border rounded-md">
        No tasks for this job yet.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Display tasks grouped by completion status */}
      <div className="space-y-3">
        {sortedData.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
            ownerMap={ownerMap}
          />
        ))}
      </div>
    </div>
  );
}