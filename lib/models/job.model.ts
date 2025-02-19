import mongoose from "mongoose";

export interface Jobs extends mongoose.Document {
  _id: string;
  title: string;
  owner: string;
  businessFunction: string;   
  tasks: object[];
  userId: string;
  dueDate?: Date;
}

// interface tasks {
// }
// TODO: Add tasks to the Jobs interface once we have a tasks feature added to the jobs table

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
  owner: {
    type: String,
    required: [false, "Please provide the Job owner's name"], // TODO: Change to true once we have an owners feature added to the jobs table
  },
  businessFunction: {
    type: String, 
  },
  dueDate: {
    type: Date,
    required: false,
  }

});

export default mongoose.models.Job || mongoose.model<Jobs>("Job", JobSchema);