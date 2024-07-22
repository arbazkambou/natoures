// import fs from 'fs';

import { AppError } from "../helper/AppError.js";
import Tour from "../models/tourModels.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.js";

// const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

// export function checkId(req, res, next, value) {
//   const tourIndex = tours.findIndex((tour) => tour.id === Number(value));
//   if (tourIndex === -1) {
//     return res.status(404).json({ status: 'Faild', message: 'Inavlid id' });
//   }
//   next();
// }

// export function checkBody(req, res, next) {
//   const { name, duration } = req.body;
//   if (!name || !duration) {
//     return res.status(400).json({ status: 'failed', message: 'Bad request' });
//   }
//   next();
// }

function aliasTop5Best(req, res, next) {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  next();
}

async function getAlltours(req, res, next) {
  try {
    //Filtering and Building Search Query
    let { page, sort, limit, field, ...queryObj } = req.query;

    //Building Advance Search Query

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt|eq)\b/g,
      (match) => `$${match}`,
    );

    //Save the search query in a var for chaining further
    let query = Tour.find(JSON.parse(queryString));

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
    const totalDocs = await Tour.countDocuments();

    if (skip >= totalDocs) {
      throw new Error("Requested page does not exist!");
    }
    query = query.skip(skip).limit(limit);

    //Executing the query
    //Below query is equal to : Tour.find().sort().select().skip().limit()
    const tours = await query;
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    // res.status(404).json({ status: "fail", message: error });
    next(AppError(err.message, 400, err));
  }
}

async function getTour(req, res, next) {
  try {
    const tour = await Tour.findById(req.params.id).populate("reviews");
    if (!tour) {
      return next(
        AppError(`No tour found with this id:${req.params.id}`, 404, tour),
      );
    }
    res.status(200).json({
      status: "Success",
      data: tour,
    });
  } catch (err) {
    // res.status(404).json({ status: "fail", message: error });
    next(AppError(err.message, 400, err));
  }
}

async function createTour(req, res, next) {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    // res.status(400).json({ status: "fail", message: error.message });
    if (err.code === 11000) {
      next(
        AppError(
          `Duplicate field name for the field:${err.keyValue.name}`,
          400,
          err,
        ),
      );
    } else if (err.name === "ValidationError") {
      next(AppError(err.message, 400, err));
    }
  }
}

async function updateTour(req, res, next) {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTour) {
      return next(
        AppError(
          `No tour found with this id:${req.params.id} and so update operation failed`,
          404,

          updatedTour,
        ),
      );
    }
    res.status(201).json({
      status: "success",
      data: {
        updatedTour,
      },
    });
  } catch (err) {
    // res.status(400).json({ status: "fail", message: error.message });
    next(AppError(err.message, 400, err));
  }
}

async function deletTour(req, res, next) {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      return next(
        AppError(
          `No tour found with this id:${req.params.id} and so delete operation failed`,
          404,
          deletedTour,
        ),
      );
    }
    res.status(200).json({
      status: "Success",
      data: {
        deletedTour,
      },
    });
  } catch (err) {
    // res.status(400).json({ status: "fail", message: "Invalid request!" });
    next(AppError(err.message, 400, err));
  }
}

//Aggregation pipeline for calculating tour stats
async function getTourStats(req, res, next) {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $avg: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgRating: -1 },
      },
    ]);

    res.status(200).json({
      status: "Success",
      data: {
        stats,
      },
    });
  } catch (err) {
    // res.status(400).json({ status: "fail", message: "Invalid request!" });
    next(AppError(err.message, 400, err));
  }
}

//Get the monthly plan or busiest month of year by using aggreggation pipeline

async function getMonthlyPlan(req, res, next) {
  try {
    const year = req.params.year;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { name: "$_id" },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);
    res.status(200).json({
      status: "Success",
      data: {
        plan,
      },
    });
  } catch (err) {
    // res.status(400).json({ status: "fail", message: "Invalid request!" });
    next(AppError(err.message, 400, err));
  }
}

export {
  getAlltours,
  getTour,
  updateTour,
  deletTour,
  createTour,
  aliasTop5Best,
  getTourStats,
  getMonthlyPlan,
};
