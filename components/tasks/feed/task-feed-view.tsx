"use client";

import { useState, useEffect } from "react";
import { NextTasks } from "@/components/tasks/feed/tasks";
import { useToast } from "@/hooks/use-toast";
import { TaskDialog } from "@/components/tasks/tasks-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Type imports only
import type { Task } from "@/lib/models/task.model";
import type { Jobs } from "@/lib/models/job.model";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [jobs, setJobs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [ownerMap, setOwnerMap] = useState<Record<string, string>>({});
  const [businessFunctionMap, setBusinessFunctionMap] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  // State for task dialog
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  
  // State for confirmation dialogs
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState<{id: string, title: string} | null>(null);
  
  // State for notes dialog
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [taskNotes, setTaskNotes] = useState<{title: string, notes: string} | null>(null);

  const fetchTasks = async () => {
    try {
      // First get all jobs to identify next tasks
      const jobsResponse = await fetch("/api/jobs");
      const jobsResult = await jobsResponse.json();
      
      if (!jobsResult.success || !Array.isArray(jobsResult.data)) {
        throw new Error("Failed to fetch jobs");
      }
      
      // Create a job map for lookup
      const jobsMap: Record<string, any> = {};
      
      // Collect all task IDs marked as next tasks in jobs
      const nextTaskIds: string[] = [];
      
      // Also collect all business function ids to fetch their names
      const businessFunctionIds: string[] = [];
      
      jobsResult.data.forEach((job: any) => {
        // Store the job in our map
        if (job._id) {
          jobsMap[job._id] = job;
        }
        
        // Check if this job has a next task
        if (job.nextTaskId) {
          nextTaskIds.push(job.nextTaskId);
        }
        
        // Collect business function ids
        if (job.businessFunctionId && !businessFunctionIds.includes(job.businessFunctionId)) {
          businessFunctionIds.push(job.businessFunctionId);
        }
      });
      
      // Update jobs state
      setJobs(jobsMap);
      
      // Fetch business function names
      if (businessFunctionIds.length > 0) {
        try {
          const bfResponse = await fetch("/api/business-functions");
          const bfResult = await bfResponse.json();
          
          if (bfResult.success && Array.isArray(bfResult.data)) {
            const bfMap: Record<string, string> = {};
            bfResult.data.forEach((bf: any) => {
              if (bf._id && bf.name) {
                bfMap[bf._id] = bf.name;
              }
            });
            setBusinessFunctionMap(bfMap);
          }
        } catch (bfError) {
          console.error("Error fetching business functions:", bfError);
        }
      }
      
      console.log("Next task IDs from jobs:", nextTaskIds);
      
      // If we have next task IDs, fetch those specific tasks
      if (nextTaskIds.length > 0) {
        // Fetch tasks one by one to avoid issues with the /api/tasks endpoint
        const nextTasks = [];
        
        for (const taskId of nextTaskIds) {
          try {
            const taskResponse = await fetch(`/api/tasks/${taskId}`);
            const taskResult = await taskResponse.json();
            
            if (taskResult.success && taskResult.data) {
              nextTasks.push(taskResult.data);
            }
          } catch (taskError) {
            console.error(`Error fetching task ${taskId}:`, taskError);
          }
        }
        
        console.log("Fetched next tasks:", nextTasks);
        return nextTasks;
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
      return [];
    }
  };

  // Fetch all necessary data: next tasks, jobs, and owners
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch owners for mapping
        const ownersResponse = await fetch("/api/owners");
        const ownersResult = await ownersResponse.json();

        let ownerMap: Record<string, string> = {};

        if (Array.isArray(ownersResult)) {
          ownersResult.forEach((owner) => {
            if (owner._id && owner.name) {
              ownerMap[owner._id] = owner.name;
            }
          });
        } else if (ownersResult.data && Array.isArray(ownersResult.data)) {
          ownersResult.data.forEach((owner: any) => {
            if (owner._id && owner.name) {
              ownerMap[owner._id] = owner.name;
            }
          });
        }

        setOwnerMap(ownerMap);

        // Fetch next tasks
        const nextStepTasks = await fetchTasks();
        
        // Log for debugging
        console.log("Next step tasks:", nextStepTasks);
        
        setTasks(nextStepTasks);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load next steps",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Function to complete a task
  const completeTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: true
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id
              ? {
                  ...task,
                  completed: true
                }
              : task
          )
        );

        // Also update the job to remove the next task reference
        // Find which job has this task as its next task
        const jobsWithThisNextTask = Object.values(jobs).filter(
          (job: any) => job.nextTaskId === id
        );
        
        // Update each job found
        for (const job of jobsWithThisNextTask) {
          await fetch(`/api/jobs/${job._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nextTaskId: null
            }),
          });
        }

        // Filter out the task after a brief delay
        setTimeout(() => {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== id)
          );
        }, 500);

        toast({
          title: "Task completed",
          description: "Great job!",
        });
      } else {
        throw new Error(result.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      });
    }
  };
  
  // Handle checkbox change
  const handleCompleteTask = (id: string, completed: boolean) => {
    if (completed) {
      // Find the task title for the confirmation dialog
      const task = tasks.find(t => t._id === id);
      if (task) {
        setTaskToComplete({ id, title: task.title });
        setCompleteDialogOpen(true);
      }
    } else {
      // Reopening a task doesn't need confirmation
      reopenTask(id);
    }
  };
  
  // Reopen a task
  const reopenTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: false
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id
              ? {
                  ...task,
                  completed: false
                }
              : task
          )
        );

        toast({
          title: "Task reopened",
          description: "Task has been reopened",
        });
      } else {
        throw new Error(result.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Error reopening task:", error);
      toast({
        title: "Error",
        description: "Failed to reopen task",
        variant: "destructive",
      });
    }
  };

  // Handle viewing task notes
  const handleViewNotes = (task: any) => {
    if (task && task.title) {
      setTaskNotes({
        title: task.title,
        notes: task.notes || "No notes available for this task."
      });
      setNotesDialogOpen(true);
    }
  };

  // Add task to calendar
  const handleAddToCalendar = (task: any) => {
    toast({
      title: "Added to calendar",
      description: `"${task.title}" has been added to your calendar`,
    });
  };

  // Edit task
  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };
  
  // Handle task update
  const handleTaskUpdate = async (taskData: any) => {
    try {
      if (!editingTask) return;
      
      const response = await fetch(`/api/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();

      if (result.success) {
        // Update the task in the local state
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === editingTask._id ? { ...task, ...taskData } : task
          )
        );
        
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        throw new Error(result.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        // Remove task from UI
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

        // Find any jobs that reference this task as nextTaskId and update them
        const jobsWithThisNextTask = Object.values(jobs).filter(
          (job: any) => job.nextTaskId === id
        );
        
        for (const job of jobsWithThisNextTask) {
          await fetch(`/api/jobs/${job._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nextTaskId: null
            }),
          });
        }

        toast({
          title: "Success",
          description: "Task deleted successfully",
        });
      } else {
        throw new Error(result.error || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  // Function to refresh tasks
  const refreshTasks = async () => {
    setLoading(true);
    try {
      // Fetch next tasks based on job.nextTaskId
      const nextStepTasks = await fetchTasks();
      setTasks(nextStepTasks);
    } catch (error) {
      console.error("Error refreshing next tasks:", error);
      toast({
        title: "Error",
        description: "Failed to refresh next steps",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6">
        <div className="w-full">
          <NextTasks
            tasks={tasks}
            jobs={jobs}
            onComplete={handleCompleteTask}
            onViewTask={handleViewNotes}
            onAddToCalendar={handleAddToCalendar}
            ownerMap={ownerMap}
            loading={loading}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            businessFunctionMap={businessFunctionMap}
          />
        </div>
      </div>

      {/* Task Edit Dialog */}
      {editingTask && (
        <TaskDialog
          mode="edit"
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          onSubmit={handleTaskUpdate}
          initialData={editingTask}
          jobId={editingTask.jobId}
        />
      )}
      
      {/* Task Completion Confirmation Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this task as complete?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{taskToComplete?.title}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (taskToComplete) {
                  completeTask(taskToComplete.id);
                  setCompleteDialogOpen(false);
                }
              }}
            >
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Task Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{taskNotes?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-sm font-medium mb-2">Notes:</h3>
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded border max-h-60 overflow-y-auto">
              {taskNotes?.notes}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setNotesDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}