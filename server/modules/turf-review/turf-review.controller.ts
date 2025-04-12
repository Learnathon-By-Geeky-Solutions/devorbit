import { Response } from "express";
import asyncHandler from "../../shared/middleware/async";
import TurfReviewService, { ReviewFilterOptions } from "./turf-review.service";
import { AuthenticatedRequest } from "../../types/request";
import { getUserId } from "../../utils/getUserId";
import { AuthRequest } from "../auth/auth.middleware";

export default class TurfReviewController {
  private readonly turfReviewService: TurfReviewService;

  constructor() {
    this.turfReviewService = new TurfReviewService();
  }

  /**
   * @route   POST /api/v1/turf-review
   * @desc    create a new review
   * @access  Private
   */

  public CreateTurfReview = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const { turfId, rating, review, images } = req.body;

      const userId = getUserId(req);

      const newTurfReview = await this.turfReviewService.createReview({
        turfId,
        userId,
        rating,
        review,
        images,
      });

      res.status(201).json({
        success: true,
        data: newTurfReview,
      });
    }
  );

  /**
   * @route   PUT api/v1/turf-review/:reviewId
   * @desc    update a review
   * @access  Private
   */

  public UpdateReview = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const { rating, review, images } = req.body;
      const { reviewId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const updatedReview = await this.turfReviewService.updateReview(
        reviewId,
        userId,
        { rating, review, images }
      );

      res.status(200).json({ success: true, data: updatedReview });
    }
  );

  /**
   * @route   DELETE /api/v1/turf-review/:id
   * @desc    delete a review
   * @access  Private
   */

  public DeleteTurfReview = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const userId = getUserId(req);
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Review ID is required",
        });
        return;
      }

      await this.turfReviewService.deleteReview(id, userId);

      res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    }
  );

    /**
   * @route   GET /api/v1/turf-review/turf/:turfId
   * @desc    get all the reviews by turf and other filters and their average rating and rating distribution
   * @access  Public
   */

  public GetReviewsByTurf = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      const { turfId } = req.params;
      
      const options: ReviewFilterOptions = {
        turfId,
        minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
        maxRating: req.query.maxRating ? Number(req.query.maxRating) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        skip: req.query.page && req.query.limit
          ? (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string)
          : undefined,
        sortBy: req.query.sortBy as string || "createdAt",
        sortOrder: req.query.sortOrder === "asc" ? "asc" : "desc",
      };
  
      const result = await this.turfReviewService.getReviewsByTurf(turfId, options);
  
      // Calculate pagination details only if limit is provided
      const page = options.limit && options.skip
        ? Math.floor(options.skip / options.limit) + 1
        : 1;
      const pages = options.limit
        ? Math.ceil(result.total / options.limit)
        : 1;
  
      res.status(200).json({
        success: true,
        data: {
          reviews: result.reviews,
          averageRating: result.averageRating,
          ratingDistribution: result.ratingDistribution,
        },
        meta: {
          total: result.total,
          ...(options.limit && { 
            page,
            limit: options.limit,
            pages 
          }),
        },
      });
    }
  );
  
}
