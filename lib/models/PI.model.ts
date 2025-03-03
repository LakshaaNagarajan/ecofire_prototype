// lib/models/qbo.model.ts
import mongoose from "mongoose";

export interface PIs extends mongoose.Document {
  _id: string;
  name: string;
  improvement: string;
  targetValue: number;
  notes?: string;
  userId: string;
}

/* PISchema will correspond to a collection in your MongoDB database. */
const PIsSchema = new mongoose.Schema<PIs>({
  userId: {
    type: String,
    required: [true, "User ID is required"],
    index: true // Add index for better query performance
  },
  name: {
    type: String,
    required: [true, "Please provide a name for this PI."],
  },
  improvement: {
    type: String,
    required: false,
  },
  targetValue: {
    type: Number,
    required: [true, "Please provide a target value."],
  },
  notes: {
    type: String,
    required: false,
  }
});

export default mongoose.models.PI || mongoose.model<PIs>("PI", PIsSchema);