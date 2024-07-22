import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have name"],
      minLength: 5,
    },
    email: {
      type: String,
      required: [true, "A user must have email address"],
      validate: [
        validator.isEmail,
        "Please enter your complete and correct email",
      ],
      unique: true,
      lowercase: true,
    },
    photo: { type: String, default: "default.jpg" },
    role: {
      type: String,
      enum: ["admin", "guide", "lead-guide", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm password"],
      //This validation only workds on create() and save() method
      validate: [
        function (el) {
          return el === this.password;
        },
        "Passwords are not the same",
      ],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    status: {
      type: String,
      enum: ["active", "inactive", "block"],
      default: "inactive",
    },
    lockedUntil: {
      type: Date,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// userSchema.virtual("imagePath").get(function () {
//   return `http://localhost:3000/public/img/users/${this.photo}`;
// });

userSchema.virtual("bookedTours", {
  ref: "Booking",
  localField: "_id",
  foreignField: "user",
});

// tourSchema.virtual("reviews", {
//   ref: "Review",
//   foreignField: "tour",
//   localField: "_id",
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//Query Middleware
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: "bookedTours",
    select: "tour -_id -user",
  });
  next();
});
const User = mongoose.model("User", userSchema);

export default User;
