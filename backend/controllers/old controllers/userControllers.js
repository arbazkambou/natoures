import { AppError } from "../../helper/AppError.js";
import User from "../../models/userModels.js";
import { deleteOne, getAll, getOne, updateOne } from "./handlerFactory.js";

async function getAllUsers(req, res) {
  const users = await User.find();
  res.status(200).json({ status: "seccess", data: { users } });
}

const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "route is not defined yet" });
};

const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "route is not defined yet" });
};

async function updateMe(req, res, next) {
  try {
    //1) Extracting the data from the body that we allowed the user to udpate
    const { email, name, ...notTobeUpdate } = req.body;
    const { _id: userId } = req.user;
    console.log(notTobeUpdate);
    if (Object.keys(notTobeUpdate).length !== 0) {
      return next(AppError("You can only update your name or email here", 400));
    }

    //2). Get the user and udates the allowed fileds
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    );

    //3). Send the response back to the client with updated user
    res.status(200).json({ status: "success", data: { updatedUser } });
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

export { getAllUsers, createUser, deleteUser, updateMe, deleteMe };
