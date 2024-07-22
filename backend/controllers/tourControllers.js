import sharp from "sharp";
import { AppError } from "../helper/AppError.js";
import Tour from "../models/tourModels.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.js";
import multer from "multer";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(AppError("Not an image! Please upload image only!", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// const multerMiddlewareForUploadingUserPhoto = upload.single("photo");
//upload.single() fro uploading singe image
//upload.array([]) for uploading multiple images in one field
//upload.fields([]) for uploaidng of mix type single and multiple at the same time
const multerMiddlewareForUploadingTourPhotos = upload.fields([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 3,
  },
]);

const tourPhotosResizeMiddleware = async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  //1). resizing image cover
  req.body.imageCover = `tour-${req.params.id || req.user._id}-${Date.now()}.jpg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2).  resizing the tour images
  const images = [];
  await Promise.all(
    req.files.images.map(async (image, i) => {
      const imageName = `tour-${req.params.id || req.user._id}-${Date.now()}-${i + 1}.jpg`;
      await sharp(image.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${imageName}`);
      images.push(imageName);
    }),
  );
  req.body.images = images;
  // if (!req.file) return next();
  // req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`;
  // sharp(req.file.buffer)
  //   .resize(500, 500)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`public/img/users/${req.file.filename}`);
  next();
};

function aliasTop5Best(req, res, next) {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  next();
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

async function getToursWithin(req, res, next) {
  try {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");

    const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

    if (!latlng) {
      return next(
        AppError(
          "Please provide latitude and longitude in the format lat,lng",
          401,
        ),
      );
    }

    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: tours,
    });
  } catch (err) {
    return next(AppError(err.message, 404, err));
  }
}

async function getDistances(req, res, next) {
  try {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");

    const multiplier = unit === "mi" ? 0.000621371 : 0.001;

    if (!latlng) {
      return next(
        AppError(
          "Please provide latitude and longitude in the format lat,lng",
          401,
        ),
      );
    }

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng * 1, lat * 1],
          },
          distanceField: "distance",
          distanceMultiplier: multiplier,
        },
      },
    ]);
    res.status(200).json({
      status: "success",

      data: distances,
    });
  } catch (err) {
    return next(AppError(err.message, 404, err));
  }
}

//Here 2nd argument is for populate function
const getTour = getOne(Tour, { path: "reviews" });
const getAlltours = getAll(Tour);
const createTour = createOne(Tour);
const updateTour = updateOne(Tour);
const deletTour = deleteOne(Tour);

export {
  getAlltours,
  getTour,
  updateTour,
  deletTour,
  createTour,
  aliasTop5Best,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  multerMiddlewareForUploadingTourPhotos,
  tourPhotosResizeMiddleware,
};
