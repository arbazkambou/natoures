import app from "./app.js";
import mongoose from "mongoose";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

const db = process.env.CONNECTION_STRING.replace(
  "<password>",
  process.env.PASSWORD,
);

// async function connectToDatabase() {
//   try {
//     await mongoose.connect(db);
//     console.log("Connected successfully");
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// connectToDatabase();

mongoose.connect(db).then(() => console.log("Connected Successfully!"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server is running on port 3000");
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
