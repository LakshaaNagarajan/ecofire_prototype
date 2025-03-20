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
    console.log("Sorting tasks, total:", data.length);
    
    // Debug: log completion status of each task
    data.forEach(task => {
      console.log(`Task: ${task.title}, Completed: ${task.completed}, Next: ${task.isNextTask}`);
    });
    
    // Create a new array to avoid mutating the original data
    return [...data].sort((a, b) => {
      // First, sort by completion status
      const aCompleted = Boolean(a.completed);
      const bCompleted = Boolean(b.completed);
      
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1; // Completed tasks go to the bottom
      }
      
      // If both have the same completion status, sort by next task status
      // but only if they're not completed
      if (!aCompleted && !bCompleted) {
        const aIsNextTask = Boolean(a.isNextTask);
        const bIsNextTask = Boolean(b.isNextTask);
        
        if (aIsNextTask !== bIsNextTask) {
          return aIsNextTask ? -1 : 1; // Next task goes to the top
        }
      }
      
      // If both have the same completion and next task status, keep original order
      return 0;
    });
  }, [data]); // Ensure this reruns when data changes
  
  if (!sortedData.length) {
    return (
      <div className="p-8 text-center text-gray-500 border rounded-md">
        No tasks for this job yet.
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      <div className="space-y-3">
        {sortedData.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={(id, completed) => {
              // When a task is completed, call the handler
              onComplete(id, completed);
              
              // If this is the next task and it's being completed,
              // make sure to update the isNextTask property
              if (task.isNextTask && completed) {
                task.isNextTask = false; // Remove next task status if completed
              }
            }}
            ownerMap={ownerMap}
          />
        ))}
      </div>
    </div>
  );
}