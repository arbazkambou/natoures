import express from "express";
import { protect, restrict } from "../controllers/authControllers.js";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  getCheckoutSession,
  myBookings,
  updateBooking,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router({ mergeParams: true });
bookingRouter.get("/myBookings", protect, myBookings);
bookingRouter
  .route("/")
  .get(protect, restrict("lead-guide", "admin", "guide"), getAllBookings)
  .post(protect, restrict("admin"), createBooking);

bookingRouter
  .route("/:id")
  .get(protect, restrict("admin", "guide", "lead-guide"), getBooking)
  .patch(protect, restrict("admin"), updateBooking)
  .delete(protect, restrict("admin"), deleteBooking);

// bookingRouter.post("/saveBooking", protect, saveBooking);
bookingRouter.get("/checkout-session/:tourId", protect, getCheckoutSession);

export default bookingRouter;
