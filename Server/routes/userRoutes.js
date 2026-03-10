import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/me", auth, (req, res) => {
  res.json({
    message: "User verified successfully",
    userId: req.user.id,
    email: req.user.email,
  });
});

export default router;
