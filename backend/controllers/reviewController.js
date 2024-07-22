import Review from "../models/reviewModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.js";

const getAllReviews = getAll(Review);

function getTourAndUserIds(req, res, next) {
  let { tour, user } = req.body;
  if (!tour) req.body.tour = req.params.tourId;
  if (!user) req.body.user = req.user._id;
  next();
}

// const createReview = createOne(Review);
const getReview = getOne(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);
const createReview = createOne(Review);
export {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getTourAndUserIds,
  getReview,
};
