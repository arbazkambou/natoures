import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  getTourAndUserIds,
  updateReview,
} from "../controllers/reviewController.js";
import { protect, restrict } from "../controllers/authControllers.js";

const reviewRouter = express.Router({ mergeParams: true });
reviewRouter.use(protect);
reviewRouter
  .route("/")
  .get(getAllReviews)
  .post(restrict("user", "admin"), getTourAndUserIds, createReview);
reviewRouter
  .route("/:id")
  .get(getReview)
  .patch(restrict("user", "admin"), updateReview)
  .delete(restrict("user", "admin"), deleteReview);

export default reviewRouter;
