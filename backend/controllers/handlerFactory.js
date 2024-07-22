import { AppError } from "../helper/AppError.js";
import Booking from "../models/bookingModel.js";
import Review from "../models/reviewModel.js";
import Tour from "../models/tourModels.js";
import User from "../models/userModels.js";

const deleteOne = (Model) => async (req, res, next) => {
  try {
    if (Model === Tour) {
      await Review.deleteMany({ tour: req.params.id });
      await Booking.deleteMany({ tour: req.params.id });
    }
    if (Model === User) {
      await Review.deleteMany({ User: req.params.id });
      await Booking.deleteMany({ User: req.params.id });
    }
    const deletedDoc = await Model.findByIdAndDelete(req.params.id);
    if (!deletedDoc) {
      return next(
        AppError(
          `No document found with this id:${req.params.id} and so delete operation failed`,
          404,
          deletedDoc,
        ),
      );
    }
    res.status(204).json({
      status: "Success",
    });
  } catch (err) {
    // res.status(400).json({ status: "fail", message: "Invalid request!" });
    next(AppError(err.message, 400, err));
  }
};

const updateOne = (Model) => async (req, res, next) => {
  try {
    if (req.body.locations) {
      req.body.locations = JSON.parse(req.body.locations);
    }
    if (req.body.startLocation) {
      req.body.startLocation = JSON.parse(req.body.startLocation);
    }
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) {
      return next(
        AppError(
          `No doc found with this id:${req.params.id} and so update operation failed`,
          404,

          updatedDoc,
        ),
      );
    }
    res.status(201).json({
      status: "success",
      data: {
        data: updatedDoc,
      },
    });
  } catch (err) {
    // res.status(400).json({ status: "fail", message: error.message });
    next(AppError(err.message, 400, err));
  }
};

const createOne = (Model) => async (req, res, next) => {
  try {
    if (Model === Review) {
      const { user, tour } = req.body;
      const booking = await Booking.findOne({ user: user, tour: tour });
      if (!booking)
        return next(
          AppError(
            "You can not review that tour because you have not booked it!",
            401,
          ),
        );
    }

    if (Model === Tour) {
      req.body.locations = JSON.parse(req.body.locations);
      req.body.startLocation = JSON.parse(req.body.startLocation);
    }

    if (Model === Booking) {
      const user = await User.findById(req.body.user);
      if (!user) {
        return next(AppError("No user exist with this user id!", 401));
      }
      const tour = await Tour.findById(req.body.tour);
      if (!tour) {
        return next(AppError("No tour exist with this tour id!", 401));
      }
      const booking = await Booking.findOne({
        user: req.body.user,
        tour: req.body.tour,
      });
      if (booking) {
        return next(AppError("You have already booked that tour!", 401));
      }
    }
    const docs = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      docs,
    });
  } catch (err) {
    // res.status(400).json({ status: "fail", message: error.message });
    if (err.code === 11000) {
      next(AppError(err.errmsg, 400, err));
    } else if (err.name === "ValidationError") {
      next(AppError(err.message, 400, err));
    }
  }
};

const getOne = (Model, populateOptions) => async (req, res, next) => {
  try {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions).populate({
        path: "bookings",
        select: "user",
      });
    }
    const docs = await query;
    if (!docs) {
      return next(AppError(`No doc found with this id:${req.params.id}`, 404));
    }
    res.status(200).json({
      status: "Success",
      docs,
    });
  } catch (err) {
    // res.status(404).json({ status: "fail", message: error });
    next(AppError(err.message, 400, err));
  }
};

const getAll = (Model) => async (req, res, next) => {
  try {
    //Modification for get all reviews on a specific tour
    let filter = {};
    const { tourId, userId } = req.params;
    if (tourId) filter = { tour: tourId };
    if (userId) filter = { user: userId };
    //Filtering and Building Search Query
    let { page, sort, limit, field, ...queryObj } = req.query;

    //Building Advance Search Query

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt|eq)\b/g,
      (match) => `$${match}`,
    );

    //Save the search query in a var for chaining further
    let query = Model.find(JSON.parse(queryString)).find(filter);

    //Now chaining sort with seearch Query
    if (sort) {
      let sortBy = sort.replaceAll(",", " ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-price");
    }

    // //Field Limiting or projection only the specific fields
    if (field) {
      let selectOnly = field.replaceAll(",", " ");
      query = query.select(selectOnly);
    } else {
      query = query.select("-__v");
    }

    //pagniation
    page = Number(page || 1);
    limit = Number(limit || 10);
    const skip = (page - 1) * limit;
    const totalDocs = await Model.countDocuments();
    if (Model !== Booking) {
      if (skip >= totalDocs) {
        throw new Error("Requested page does not exist!");
      }
    }
    query = query.skip(skip).limit(limit);

    //Executing the query
    //Below query is equal to : Tour.find().sort().select().skip().limit()
    const docs = await query;

    res.status(200).json({
      status: "success",
      result: docs.length,
      totalDocs,
      data: docs,
    });
  } catch (err) {
    // res.status(404).json({ status: "fail", message: error });
    next(AppError(err.message, 400, err));
  }
};

export { deleteOne, updateOne, createOne, getOne, getAll };
