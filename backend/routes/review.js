import express from "express";
import {
  createReview,
  getProviderReviews,
  getAllReviews,
  toggleReviewVisibility,
} from "../controllers/reviewController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/provider/:providerId", getProviderReviews);

// Customer routes
router.post("/:bookingId", protect, authorizeRoles("customer"), createReview);

// Admin routes
router.get("/", protect, authorizeRoles("admin"), getAllReviews);
router.put("/:id/toggle", protect, authorizeRoles("admin"), toggleReviewVisibility);

export default router;