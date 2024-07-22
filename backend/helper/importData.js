import fs from "fs";
import mongoose from "mongoose";
import Tour from "../models/tourModels.js";
import dotenv from "dotenv";
import User from "../models/userModels.js";
import Review from "../models/reviewModel.js";

const tours = JSON.parse(
  fs.readFileSync("./dev-data/data/tours.json", "utf-8"),
);
const users = JSON.parse(
  fs.readFileSync("./dev-data/data/users.json", "utf-8"),
);
const reviews = JSON.parse(
  fs.readFileSync("./dev-data/data/reviews.json", "utf-8"),
);
dotenv.config({ path: "./config.env" });
const db = process.env.CONNECTION_STRING.replace(
  "<password>",
  process.env.PASSWORD,
);

async function connectToDatabaseDeleteAndLoadData() {
  try {
    await mongoose.connect(db);
    console.log("Connected!");
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Deleted!");
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews, { validateBeforeSave: false });
    console.log("Loaded!");
    mongoose.connection.close();
    console.log("Closed!");
  } catch (error) {
    console.log(error);
  }
}

connectToDatabaseDeleteAndLoadData();
