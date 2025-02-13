import mongoose from "mongoose";

export interface Jobs extends mongoose.Document {
  _id: string;
  title: string;
  owner: string;
  businessFunction: string;   
  tasks: object[];
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
  title: {
    /* The title of this Job */

    type: String,
    required: [true, "Please provide a title for this Job."],
  },
  owner: {
    /* The owner of this Job */

    type: String,
    required: [false, "Please provide the Job owner's name"], // TODO: Change to true once we have an owners feature added to the jobs table
  },
  businessFunction: {
    /* List of business functions, if applicable */

    type: String,
  },

});

export default mongoose.models.Job || mongoose.model<Jobs>("Job", JobSchema);