import mongoose from "mongoose";

const studentFeesSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  tuitionFees: {
    type: Number,
    required: true,
  },
  hostelFees: {
    type: Number,
    required: true,
  },
  messFees: {
    type: Number,
    required: true,
  },
  totalFees: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const StudentFees = mongoose.model("StudentFees", studentFeesSchema);
