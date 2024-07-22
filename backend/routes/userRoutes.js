import express from "express";
import {
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  multerMiddlewareForUploadingUserPhoto,
  photoResizeMiddleware,
  updateMe,
  updateUser,
} from "../controllers/userControllers.js";
import {
  confirmEmail,
  forgortPassword,
  login,
  logout,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from "../controllers/authControllers.js";
import { restrict } from "../controllers/authControllers.js";
import bookingRouter from "./bookingRoutes.js";
import reviewRouter from "./reviewRoutes.js";

const router = express.Router();
router.use("/:userId/reviews", reviewRouter);
router.use("/:userId/bookings", bookingRouter);
router.post("/signup", signup);
router.get("/confirmEmail/:token/user/:userId", confirmEmail);
router.post("/login", login);
router.post("/forgotPassword", forgortPassword);
router.post("/resetPassword/:token", resetPassword);
router.delete("/logout", logout);

router.patch("/updatePassword/", protect, updatePassword);
router.patch(
  "/updateMe/",
  protect,
  multerMiddlewareForUploadingUserPhoto,
  photoResizeMiddleware,
  updateMe,
);
router.delete("/deleteMe/", protect, deleteMe);
router.get("/getMe/", protect, getMe, getUser);
router.route("/").get(protect, restrict("admin"), getAllUsers);
router
  .route("/:id")
  .get(protect, restrict("admin"), getUser)
  .patch(protect, restrict("admin"), updateUser)
  .delete(protect, restrict("admin"), deleteUser);

export default router;
