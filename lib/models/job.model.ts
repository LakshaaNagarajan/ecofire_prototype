import mongoose from "mongoose";

export interface Jobs extends mongoose.Document {
  _id: string;
  title: string;
  notes: string;
  owner: string;
  businessFunctionId: string;   
  userId: string;
  dueDate?: Date;
  isDone: boolean;
  impact?: Number;
  nextTaskId?: string; // Added field to track the next task
  tasks?: string[]; // Array of task IDs associated with this job
}

enum level {
    "High",
    "Medium",
    "Low"
} //to be used with the tasks feature, for adding a level of focus to each task

/* JobSchema will correspond to a collection in your MongoDB database. */
const JobSchema = new mongoose.Schema<Jobs>({
  userId: {
    type: String,
    required: [true, "User ID is required"],
    index: true // Add index for better query performance
  },
  title: {
    type: String,
    required: [true, "Please provide a title for this Job."],
  },
  notes: {
    type: String,
    required: false,
  },
  owner: {
    type: String,
    required: [false, "Please provide the Job owner's name"], // TODO: Change to true once we have an owners feature added to the jobs table
  },
  businessFunctionId: {
    type: String, 
    required: false,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  isDone: {
    type: Boolean,
    default: false,
    required: true
  },
  impact: {
    type: Number,
    default: 0,
    required: false 
  },
  nextTaskId: {
    type: String,
    required: false
  },
  tasks: {
    type: [String],
    required: false,
    default: []
  }
});

export default mongoose.models.Job || mongoose.model<Jobs>("Job", JobSchema);