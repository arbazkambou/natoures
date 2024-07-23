import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { AppError } from "./helper/AppError.js";
import { globalErrorHandler } from "./controllers/globalErrorHandler.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import reviewRouter from "./routes/reviewRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bookingRouter from "./routes/bookingRoutes.js";
import Stripe from "stripe";
import { stripeWebhookMiddleware } from "./controllers/bookingController.js";

//Reading configuration from config.env using dotenv package
dotenv.config({ path: "./config.env" });

//Creating app instance of express method
const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    // origin: [process.env.FRONTEND_ORIGIN],
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    credentials: true,
  }),
);

app.post(
  "/stripeWebhook",
  express.raw({ type: "application/json" }),
  stripeWebhookMiddleware,
);

//Setting the important http headers by using helmet library
app.use(helmet());

//Body parser middleware reading data from req.body
app.use(express.json({ limit: "10kb" }));

//Express middleware for serving Static files like imgs
app.use("/public", express.static("public"));

//For getting the cookies sent by browser
app.use(cookieParser());

//Our own custom middleware just of tetsing purposes
// app.use((req, res, next) => {
//   req.requestTime = new Date().toLocaleString();
//   next();
// });

//Morgan middlware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiter from express-rate-limit package
const limiter = rateLimit({
  limit: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from your side. Please try again after an hour",
});

//Express mongo sanitize middleware for preventing NoSql injections
app.use(ExpressMongoSanitize());

// XSS middleware for preventing the XSS Attack such as injecting html and javascript code into req.body
// app.use(sanitizeParams, sanitizeRequestBody);

// Using hpp middleware to for preventing parameters pollutions
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

// Global middleware for rate limiting
app.use("/api", limiter);

// app.get("/", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     data: {
//       name: "Arbaz Shoukat",
//       semester: "8th",
//     },
//   });
// });

// Global middleware for routing
// app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

//Middlware for handling unhandled routes
app.all("*", (req, res, next) => {
  next(
    AppError(
      `Requested url:${req.originalUrl} was not found on this server!`,
      404,
    ),
  );
});

//Global error handling middleware
app.use(globalErrorHandler);
export default app;
