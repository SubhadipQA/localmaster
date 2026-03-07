import express from "express";
import {
  submitContact,
  getAllMessages,
  markAsRead,
} from "../controllers/contactController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public
router.post("/", submitContact);

// Admin only
router.get("/", protect, authorizeRoles("admin"), getAllMessages);
router.put("/:id/read", protect, authorizeRoles("admin"), markAsRead);

export default router;