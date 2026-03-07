import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  toggleAvailability,
  getAllProviders,
  getProviderById,
  getAllProvidersAdmin,
  approveProvider,
} from "../controllers/providerController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllProviders);

// Admin route — BEFORE /:id
router.get("/admin/all", protect, authorizeRoles("admin"), getAllProvidersAdmin);

// Provider routes — BEFORE /:id
router.get("/my/profile", protect, authorizeRoles("provider"), getMyProfile);
router.put("/profile", protect, authorizeRoles("provider"), updateMyProfile);
router.put("/toggle/availability", protect, authorizeRoles("provider"), toggleAvailability);

// Admin approve
router.put("/:id/approve", protect, authorizeRoles("admin"), approveProvider);

// Single provider — ALWAYS LAST
router.get("/:id", getProviderById);

export default router;
