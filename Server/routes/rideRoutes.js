import express from "express";
import {
  createRide,
  getAvailableRides,
  acceptRide,
  getMyRides,
  getAssignedRides,
  arriveRide,
  startRide,
  completeRide,
  createRazorpayOrder,
  markRidePaid,
} from "../controllers/rideController.js";
import auth from "../middleware/auth.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

// Rider creates ride
router.post("/", auth, requireRole("rider"), createRide);
// Driver see available Rides
router.get("/available", auth, requireRole("driver"), getAvailableRides);
// Driver accept Rides
router.patch("/:id/accept", auth, requireRole("driver"), acceptRide);

//Rider see their rides
router.get("/my-rides", auth, requireRole("rider"), getMyRides);

//Driver see assigned rides
router.get("/my-assigned", auth, requireRole("driver"), getAssignedRides);

//Ride Tracking
router.patch("/:id/arrived", auth, requireRole("driver"), arriveRide);
router.patch("/:id/start", auth, requireRole("driver"), startRide);
router.patch("/:id/complete", auth, requireRole("driver"), completeRide);

//Payment
router.post(
  "/:id/razorpay-order",
  auth,
  requireRole("rider"),
  createRazorpayOrder,
);
router.patch("/:id/pay", auth, requireRole("rider"), markRidePaid);

export default router;
