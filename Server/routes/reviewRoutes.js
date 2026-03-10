import express from "express";
import auth from "../middleware/auth.js";
import requireRole from "../middleware/roleMiddleware.js";
import {
  createReview,
  getReviewByRide,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", auth, requireRole("rider"), createReview);
router.get("/:rideId", auth, getReviewByRide);

export default router;
