import mongoose from "mongoose";
import Tour from "../models/tourModels.js";
const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: ["Review can not be empty"],
    },
    rating: {
      type: Number,
      required: [true, "Review must have some rating"],
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "A review must belong to a tour"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must belong to a tour"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//when we defined method in static object it is available of whole model which in this case is review model
//Here this keyword is pointing to the Model
reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

//Here this keyword is pointing the document which is just saved and constructor pointing to the model who create this document
reviewSchema.post("save", function () {
  this.constructor.calculateAverageRatings(this.tour);
});

//Here this keyword is pointing to query variable
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.doc.constructor.calculateAverageRatings(this.doc.tour);
});

reviewSchema.pre(/^find/, async function (next) {
  // this.populate({ path: "tour", select: "name" });
  this.populate({
    path: "user",
    select: "name photo",
  }).populate({ path: "tour", select: "name imageCover" });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

// Query middleware

export default Review;
