import { StudentFees } from "../models/studentFeesSchema.js";

export const createStudentFees = async (req, res, next) => {
  console.log(req.body);
  const { studentName, rollNumber, department, tuitionFees, hostelFees, messFees } = req.body;
  try {
    if (!studentName || !rollNumber || !department || !tuitionFees || !hostelFees || !messFees) {
      return next("Please Fill Full Form!", 400);
    }
    const totalFees = parseFloat(tuitionFees) + parseFloat(hostelFees) + parseFloat(messFees);
    await StudentFees.create({
      studentName,
      rollNumber,
      department,
      tuitionFees,
      hostelFees,
      messFees,
      totalFees,
    });
    res.status(200).json({
      success: true,
      message: "Student Fees Created!",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllStudentFees = async (req, res, next) => {
  try {
    const studentFees = await StudentFees.find();
    res.status(200).json({
      success: true,
      studentFees,
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentFeesById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentFees = await StudentFees.findById(id);
    if (!studentFees) {
      return next("Student Fees not found!", 404);
    }
    res.status(200).json({
      success: true,
      studentFees,
    });
  } catch (err) {
    next(err);
  }
};

export const updateStudentFees = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentName, rollNumber, department, tuitionFees, hostelFees, messFees } = req.body;

    const updateData = {
      studentName,
      rollNumber,
      department,
      tuitionFees,
      hostelFees,
      messFees,
      totalFees: parseFloat(tuitionFees) + parseFloat(hostelFees) + parseFloat(messFees),
      updatedAt: Date.now(),
    };

    const studentFees = await StudentFees.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!studentFees) {
      return next("Student Fees not found!", 404);
    }

    res.status(200).json({
      success: true,
      message: "Student Fees Updated!",
      studentFees,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteStudentFees = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentFees = await StudentFees.findByIdAndDelete(id);

    if (!studentFees) {
      return next("Student Fees not found!", 404);
    }

    res.status(200).json({
      success: true,
      message: "Student Fees Deleted!",
    });
  } catch (err) {
    next(err);
  }
};
