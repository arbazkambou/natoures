import { AppError } from "../helper/AppError.js";
import User from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken } from "../helper/generateToken.js";
import crypto from "crypto";
import { sendEmail } from "../helper/sendEmail.js";
let login_attempts = { email: "" };
export async function signup(req, res, next) {
  try {
    const { name, email, password, passwordConfirm, role } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    });

    const token = generateToken(newUser._id);

    const cookieOptions = {
      maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      secure: false, //So that it can only be worked on https connection
      httpOnly: true, //So that browser can not modified it
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("token", token, cookieOptions);
    newUser.password = undefined;
    res.status(201).json({
      status: "success",
      token,
      data: { newUser },
    });
  } catch (error) {
    next(AppError(error.message, 400, error));
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    //1. Chcek if email and password are in body
    if (!email || !password) {
      return next(AppError("Please enter valid email and password", 401));
    }

    //3. Check if user exist and password is correct
    const user = await User.findOne({ email }).select("+password +lockedUntil");

    //2). Counting wrong login attempts
    if (email in login_attempts && login_attempts[email] >= 3) {
      if (user.lockedUntil) {
        if (user.lockedUntil.getTime() < Date.now()) {
          login_attempts[email] = 0;
          return next(
            AppError(
              "Maximum login attempts reached. Please wait 2 minutes for login again",
              401,
            ),
          );
        } else {
          user.lockedUntil = Date.now() + 2 * 60 * 1000;
          await user.save({ validateBeforeSave: false });
          return next(
            AppError(
              "Maximum login attempts reached. Please wait 2 minutes for login again",
              401,
            ),
          );
        }
        // login_attempts[email] = 0;
      } else {
        user.lockedUntil = Date.now() + 2 * 60 * 1000;
        await user.save({ validateBeforeSave: false });
        return next(
          AppError(
            "Maximum login attempts reached. Please wait 2 minutes for login again",
            401,
          ),
        );
      }
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      if (user) {
        if (email in login_attempts) {
          login_attempts[email] += 1;
        } else {
          login_attempts[email] = 1;
        }
      }

      return next(AppError("Invalid credentials!", 401));
    }

    if (email in login_attempts) {
      login_attempts[email] = 0;
      user.lockedUntil = undefined;
      await user.save({ validateBeforeSave: false });
    }
    //4.Generate and send token if everything is ok
    const token = generateToken(user._id);
    res.status(201).json({ status: "success", token });
  } catch (err) {
    return next(AppError(err.message, 404));
  }
}

export async function protect(req, res, next) {
  //1). Geting token and check if it is there
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        AppError("You are not logged in! Please login to gain access!", 401),
      );
    }

    //2). Verify the token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    //3). Check if user still exist
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(AppError("User belogs to this token does not exist!", 401));
    }

    //4). Chck if user changed his password after the token as been granted
    if (user.passwordChangedAt) {
      if (user.passwordChangedAt.getTime() / 1000 > decoded.iat) {
        return next(
          AppError(
            "Password has been changed recently. Please login again!",
            401,
          ),
        );
      }
    }

    //5).Grant access to the protected route
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      next(AppError("Token Expired! Please login again.", 401, err));
    } else if (err.name === "JsonWebTokenError") {
      next(AppError("Invalid Token! Please login again.", 401, err));
    } else {
      next(AppError("Invalid Token! Please login again.", 401, err));
    }
  }
}

export const restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        AppError("You does not have permission to do this operation", 402),
      );
    }
    next();
  };
};

export async function forgortPassword(req, res, next) {
  //1). Getting user with provided email if it exist
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(AppError("No user found with this email adrdress", 404));
    }

    //2). Generating random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const encryptedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = encryptedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    //3).Saving the encrypted token in data base
    const updatedUser = await user.save({ validateBeforeSave: false });

    //4).Sending the plain token to client
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a patch request with your new password and confirm passwrod to this url ${resetURL} .\nAnd if you did not send this request then please ignore this!`;
    try {
      await sendEmail({
        email,
        subject: "Your password reset token (valid for 10 mins)",
        message,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(AppError("Can not send email. Please try again!", 500, err));
    }

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    next(AppError(err.message, 404, err));
  }
}

export async function resetPassword(req, res, next) {
  try {
    //1).Convert the plain token into encrypted token for comparison

    const hashedToken = await crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    //2). Check if user exit and and also token has not been expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        AppError(
          "Invalid token or it has been expired! Please try again for password reset",
          401,
        ),
      );
    }

    //3). Update the password and save it
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //4). Generate the token and send as response
    const token = await generateToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    return next(AppError(err.message, 401, err));
  }
}

export async function updatePassword(req, res, next) {
  try {
    //1). Get the user from collection
    const { password, newPassword, newPasswordConfirm } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    //2). Check if password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(
        AppError(
          "Entered password is incorrect! Try to forgot your password.",
          401,
        ),
      );
    }

    //3). If everything is ok ,Update the password
    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save();

    //4). Generate new token and login the user rin
    const token = await generateToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    return next(AppError(err.message, 404, err));
  }
}
