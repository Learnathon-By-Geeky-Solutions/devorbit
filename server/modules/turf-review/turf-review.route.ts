import express from "express";
import { protect } from "../auth/auth.middleware";
import TurfReviewController from "./turf-review.controller";

const router = express.Router();

// Protected routes
const turfReviewController = new TurfReviewController();
router.post('/', protect, turfReviewController.CreateTurfReview);
router.delete('/:id', protect, turfReviewController.DeleteTurfReview);

export default router;
