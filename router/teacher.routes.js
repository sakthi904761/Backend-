import express from "express";
const router = express.Router();

// example route
router.get("/", (req, res) => {
  res.send("Teacher routes working");
});

export default router;
