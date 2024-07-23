import { AppError } from "../helper/AppError.js";
import Review from "../models/reviewModel.js";
import User from "../models/userModels.js";
import { deleteOne, getAll, getOne, updateOne } from "./handlerFactory.js";
import multer from "multer";
import sharp from "sharp";

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

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

const multerMiddlewareForUploadingUserPhoto = upload.single("photo");

const photoResizeMiddleware = async (req, res, next) => {
  try {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
    return next();
  } catch (error) {
    return next(AppError(error.message, 400));
  }
};

async function updateMe(req, res, next) {
  try {
    //1) Extracting the data from the body that we allowed the user to udpate
    const { email, name } = req.body;
    const { _id: userId } = req.user;

    // if (Object.keys(notTobeUpdate).length !== 0) {
    //   return next(AppError("You can only update your name or email here", 400));
    // }

    const dataToBeUpdate = { email, name };
    if (req.file) {
      dataToBeUpdate.photo = req.file.filename;
    }
    //2). Get the user and udates the allowed fileds
    const updatedUser = await User.findByIdAndUpdate(userId, dataToBeUpdate, {
      new: true,
      runValidators: true,
    });

    //3). Send the response back to the client with updated user
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (err) {
    return next(AppError(err.message, 500));
  }
}

async function deleteMe(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    return next(AppError(err.message, 500));
  }
}

const getMe = (req, res, next) => {
  req.params.id = req.user._id;

  next();
};
const getAllUsers = getAll(User);
const getUser = getOne(User);
const updateUser = updateOne(User);
const deleteUser = deleteOne(User, Review);

export {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  multerMiddlewareForUploadingUserPhoto,
  photoResizeMiddleware,
};
