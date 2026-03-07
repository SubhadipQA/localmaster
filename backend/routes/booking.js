import express from "express";
import {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Customer routes
router.post("/", protect, authorizeRoles("customer"), createBooking);
router.get("/my", protect, authorizeRoles("customer"), getMyBookings);
router.put("/:id/cancel", protect, authorizeRoles("customer"), cancelBooking);

// Provider routes
router.get("/provider", protect, authorizeRoles("provider"), getProviderBookings);
router.put("/:id/accept", protect, authorizeRoles("provider"), acceptBooking);
router.put("/:id/reject", protect, authorizeRoles("provider"), rejectBooking);
router.put("/:id/status", protect, authorizeRoles("provider"), updateBookingStatus);

// Both customer and provider
router.get("/:id", protect, getBookingById);

export default router;