import { AppError } from "../helper/AppError.js";
import Review from "../models/reviewModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.js";

async function getAllReviews(req, res, next) {
  try {
    let filter = {};
    const { tourId } = req.params;
    if (tourId) filter = { tour: tourId };
    const reviews = await Review.find(filter);
    res.status(200).json({
      status: "success",
      data: {
        reviews,
      },
    });
  } catch (err) {
    return next(AppError(err.message, 404, err));
  }
}

async function createReview(req, res, next) {
  try {
    const { review, rating, tour, user } = req.body;

    if (!tour) req.body.tour = req.params.tourId;
    if (!user) req.body.user = req.user._id;
    console.log(user);
    const newReview = await Review.create({ review, rating, tour, user });
    res.status(200).json({
      status: "success",
      data: {
        newReview,
      },
    });
  } catch (err) {
    return next(AppError(err.message, 404, err));
  }
}

export { getAllReviews, createReview };
