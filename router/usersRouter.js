import express from "express";
import { studentSignIn, teacherSignIn, adminSignIn } 
from "../controllers/usersControllers.js";

const router = express.Router();

router.post('/student/signin', studentSignIn);
router.post('/teacher/signin', teacherSignIn);
router.post('/admin/signin', adminSignIn);

export default router;
