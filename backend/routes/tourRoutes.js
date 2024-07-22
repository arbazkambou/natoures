import express from "express";
import {
  aliasTop5Best,
  createTour,
  deletTour,
  getAlltours,
  getDistances,
  getMonthlyPlan,
  getTour,
  getTourStats,
  getToursWithin,
  multerMiddlewareForUploadingTourPhotos,
  tourPhotosResizeMiddleware,
  updateTour,
} from "../controllers/tourControllers.js";
import { protect, restrict } from "../controllers/authControllers.js";
import reviewRouter from "./reviewRoutes.js";
import bookingRouter from "./bookingRoutes.js";

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);
router.use("/:tourId/bookings", bookingRouter);

//Middleware for getting top 5 best tours using aggregation pipeline
router.route("/top-5-best").get(aliasTop5Best, getAlltours);

//Middleware for getting top tours stats using aggregation pipeline
router.route("/tour-stats").get(getTourStats);

//Middleware for getting top tours busiest months of year using aggregation pipeline
router
  .route("/monthly-plan/:year")
  .get(protect, restrict("admin", "lead-guide", "guide"), getMonthlyPlan);

//Tour route middleware
router
  .route("/")
  .get(getAlltours)
  .post(
    protect,
    restrict("admin", "lead-guide"),
    multerMiddlewareForUploadingTourPhotos,
    tourPhotosResizeMiddleware,
    createTour,
  );
router
  .route("/:id")
  .get(getTour)
  .patch(
    protect,
    restrict("admin", "lead-guide"),
    multerMiddlewareForUploadingTourPhotos,
    tourPhotosResizeMiddleware,
    updateTour,
  )
  .delete(protect, restrict("admin", "lead-guide"), deletTour);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);
router.route("/distances/:latlng/unit/:unit").get(getDistances);

export default router;
