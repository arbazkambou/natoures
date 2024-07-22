import mongoose from "mongoose";
import slugify from "slugify";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have name"],
      unique: true,
      trim: true,
      maxLength: [50, "A name must have less than or equal to 20 character"],
      minLength: [5, "A name must have greater than or equal to 5 character"],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have maximum group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have difficulty"],
      trim: true,
      enum: {
        values: ["easy", "medium", "difficult", "hard"],
        message: "Diffculty level should eith be easy, medium or hard",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, "Rating should be in between 0 and 5"],
      max: [5, "Rating should be in between 0 and 5"],
      set: (value) => Number(value.toFixed(1)),
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have price"],
    },
    priceDiscount: {
      type: Number,
      // validate: [
      //   function (value) {
      //     return value <= this.price;
      //   },
      //   "Discount should be less than or equal to price",
      // ],\

      //Custom validator
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message: "Discount should be less than or equal to price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have an image cover"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: "5c8a1f4e2f8fb814b56fa185",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: "2dsphere" });
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.virtual("imageCoverPath").get(function () {
  if (this.imageCover) {
    return `http://localhost:3000/public/img/tours/${this.imageCover}`;
  }
});

tourSchema.virtual("imagesPath").get(function () {
  if (this.images && this.images.length > 0) {
    return this.images.map(
      (image) => `http://localhost:3000/public/img/tours/${image}`,
    );
  }
});
///Document middlware: runs before .save() and .create() method not any or method like insertMany() and has doc that is being sent to database for save
tourSchema.pre("save", function (next) {
  // console.log(this); this keyword will have the document that will be saved to database
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Query middleware for embedding user document based on user ids,,,in Tour model
// tourSchema.pre("save", async function (next) {
//   const guidePromises = this.guides.map(
//     async (guideId) => await User.findById(guideId),
//   );
//   this.guides = await Promise.all(guidePromises);
//   next();
// });

///runs after .save() and .create() method or document has been saved in database and has new saved doc
// tourSchema.post("save", function (doc, next) {
//   console.log(doc); doc property will have the newly created document in database
//   next();
// });

//Query middlewares
tourSchema.pre(/^find/, function (next) {
  this.find({
    // $or: [{ secretTour: { $exists: false } }, { secretTour: false }],
    secretTour: { $ne: true },
  });

  this.start = Date.now();

  next();
});

//Aggregation middleware
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({
//     $match: {
//       $or: [{ secretTour: { $exists: false } }, { secretTour: false }],
//     },
//   });
//   next();
// });

tourSchema.pre(/^find/, async function () {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
});

// tourSchema.post(/^find/, function (doc, next) {
//   console.log(
//     `Query takes ${Date.now() - this.start} milliseconds to execute!`,
//   );
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
