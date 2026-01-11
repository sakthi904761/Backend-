import express from "express";
import {
  createStudentFees,
  getAllStudentFees,
  getStudentFeesById,
  updateStudentFees,
  deleteStudentFees,
} from "../controllers/studentFeesController.js";

const router = express.Router();

router.get("/getall", getAllStudentFees);
router.get("/:id", getStudentFeesById);
router.post("/", createStudentFees);
router.put("/:id", updateStudentFees);
router.delete("/:id", deleteStudentFees);

export default router;
