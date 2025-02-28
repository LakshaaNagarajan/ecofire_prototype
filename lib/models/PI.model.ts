import mongoose from "mongoose";

export interface PI extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  department?: string;
  researchArea: string[];
  userId: string;
  dateJoined: Date;
}

// You can add more enums if needed, for example:
enum ResearchStatus {
  "Active",
  "OnLeave",
  "Retired"
}

/* PISchema will correspond to a collection in your MongoDB database. */
const PISchema = new mongoose.Schema<PI>({
  userId: {
    type: String,
    required: [true, "User ID is required"],
    index: true // Add index for better query performance
  },
  firstName: {
    type: String,
    required: [true, "Please provide a first name."],
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name."],
  },
  email: {
    type: String,
    required: [true, "Please provide an email address."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  institution: {
    type: String,
    required: [true, "Please provide the institution name."],
  },
  department: {
    type: String,
    required: false,
  },
  researchArea: {
    type: [String],
    required: [true, "Please provide at least one research area."],
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
  // You can add more fields as needed
});

export default mongoose.models.PI || mongoose.model<PI>("PI", PISchema);
