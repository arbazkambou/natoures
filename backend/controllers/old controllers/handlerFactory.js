import { AppError } from "../../helper/AppError.js";
import Tour from "../../models/tourModels.js";

const deleteOne = (Model) => async (req, res, next) => {
  try {
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

// async function deletTour(req, res, next) {
//   try {
//     const deletedTour = await Tour.findByIdAndDelete(req.params.id);
//     if (!deletedTour) {
//       return next(
//         AppError(
//           `No tour found with this id:${req.params.id} and so delete operation failed`,
//           404,
//           deletedTour,
//         ),
//       );
//     }
//     res.status(200).json({
//       status: "Success",
//       data: {
//         deletedTour,
//       },
//     });
//   } catch (err) {
//     // res.status(400).json({ status: "fail", message: "Invalid request!" });
//     next(AppError(err.message, 400, err));
//   }
// }

const updateOne = (Model) => async (req, res, next) => {
  try {
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
        updatedDoc,
      },
    });
  } catch (err) {
    // res.status(400).json({ status: "fail", message: error.message });
    next(AppError(err.message, 400, err));
  }
};

// async function updateTour(req, res, next) {
//     try {
//       const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//       });
//       if (!updatedTour) {
//         return next(
//           AppError(
//             `No tour found with this id:${req.params.id} and so update operation failed`,
//             404,

//             updatedTour,
//           ),
//         );
//       }
//       res.status(201).json({
//         status: "success",
//         data: {
//           updatedTour,
//         },
//       });
//     } catch (err) {
//       // res.status(400).json({ status: "fail", message: error.message });
//       next(AppError(err.message, 400, err));
//     }
//   }

const createOne = (Model) => async (req, res, next) => {
  try {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newDoc,
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
};

const getOne = (Model, populateOptions) => async (req, res, next) => {
  try {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;
    if (!doc) {
      return next(AppError(`No doc found with this id:${req.params.id}`, 404));
    }
    res.status(200).json({
      status: "Success",
      data: doc,
    });
  } catch (err) {
    // res.status(404).json({ status: "fail", message: error });
    next(AppError(err.message, 400, err));
  }
};

// async function getTour(req, res, next) {
//   try {
//     const tour = await Tour.findById(req.params.id).populate("reviews");
//     if (!tour) {
//       return next(
//         AppError(`No tour found with this id:${req.params.id}`, 404, tour),
//       );
//     }
//     res.status(200).json({
//       status: "Success",
//       data: tour,
//     });
//   } catch (err) {
//     // res.status(404).json({ status: "fail", message: error });
//     next(AppError(err.message, 400, err));
//   }
// }

const getAll = (Model) => async (req, res, next) => {
  try {
    //Modification for get all reviews on a specific tour
    let filter = {};
    const { tourId } = req.params;
    if (tourId) filter = { tour: tourId };

    //Filtering and Building Search Query
    let { page, sort, limit, field, ...queryObj } = req.query;

    //Building Advance Search Query

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt|eq)\b/g,
      (match) => `$${match}`,
    );

    console.log(queryString);
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
    const totalDocs = await Tour.countDocuments();

    if (skip >= totalDocs) {
      throw new Error("Requested page does not exist!");
    }
    query = query.skip(skip).limit(limit);

    //Executing the query
    //Below query is equal to : Tour.find().sort().select().skip().limit()
    const docs = await query;
    res.status(200).json({
      status: "success",
      result: docs.length,
      data: {
        docs,
      },
    });
  } catch (err) {
    // res.status(404).json({ status: "fail", message: error });
    next(AppError(err.message, 400, err));
  }
};

// async function getAlltours(req, res, next) {
//   try {
//     //Filtering and Building Search Query
//     let { page, sort, limit, field, ...queryObj } = req.query;

//     //Building Advance Search Query

//     let queryString = JSON.stringify(queryObj);
//     queryString = queryString.replace(
//       /\b(gte|gt|lte|lt|eq)\b/g,
//       (match) => `$${match}`,
//     );

//     //Save the search query in a var for chaining further
//     let query = Tour.find(JSON.parse(queryString));

//     //Now chaining sort with seearch Query
//     if (sort) {
//       let sortBy = sort.replaceAll(",", " ");
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort("-price");
//     }

//     // //Field Limiting or projection only the specific fields
//     if (field) {
//       let selectOnly = field.replaceAll(",", " ");
//       query = query.select(selectOnly);
//     } else {
//       query = query.select("-__v");
//     }

//     //pagniation
//     page = Number(page || 1);
//     limit = Number(limit || 10);
//     const skip = (page - 1) * limit;
//     const totalDocs = await Tour.countDocuments();

//     if (skip >= totalDocs) {
//       throw new Error("Requested page does not exist!");
//     }
//     query = query.skip(skip).limit(limit);

//     //Executing the query
//     //Below query is equal to : Tour.find().sort().select().skip().limit()
//     const tours = await query;
//     res.status(200).json({
//       status: "success",
//       result: tours.length,
//       data: {
//         tours: tours,
//       },
//     });
//   } catch (err) {
//     // res.status(404).json({ status: "fail", message: error });
//     next(AppError(err.message, 400, err));
//   }
// }

export { deleteOne, updateOne, createOne, getOne, getAll };
