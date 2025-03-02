import express from "express";
import {
  createOrganization,
  deleteOrganization,
  updateOrganization,
} from "./organization.controller";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory for Cloudinary upload

// Create organization
router.post("/", upload.array("images", 5), createOrganization); // Allow up to 5 images

// Update organization
router.put("/:id", upload.array("images", 5), updateOrganization);

// Delete organization
router.delete("/:id", deleteOrganization);

export default router;
