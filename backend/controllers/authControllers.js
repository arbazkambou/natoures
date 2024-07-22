import { AppError } from "../helper/AppError.js";
import User from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken } from "../helper/generateToken.js";
import crypto from "crypto";
import { Email } from "../helper/sendEmail.js";

let login_attempts = { email: "" };

export async function signup(req, res, next) {
  try {
    const { name, email, password, passwordConfirm, role } = req.body;
    //1). Check if user with provided email is already registered?
    const user = await User.findOne({ email: email });

    if (user) {
      if (user.status === "inactive") {
        return next(
          AppError(
            "You have registered already. Please confirm your email to activate your account!",
            401,
          ),
        );
      }
      return next(
        AppError(
          "A user with this email address is already registered! Try another one.",
          401,
        ),
      );
    }
    //2). Create the user in database with default value for status field is inactive
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const url = `${req.protocol}://${req.get("host")}/api/v1/users/confirmEmail/${token}/user/${newUser._id}`;

    await new Email(newUser, url).sendConfirmEmail();

    res.status(201).json({
      status: "success",
      message:
        "Your account has been created. Please confirm your email to activate your account.",
    });
  } catch (error) {
    next(AppError(error.message, 400, error));
  }
}

export async function confirmEmail(req, res, next) {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(decoded.id, { status: "active" });
    res.redirect(`${process.env.FRONTEND_ORIGIN}/login`);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const token = jwt.sign(
        { id: req.params.userId },
        process.env.JWT_SECRET,
        {
          expiresIn: "10m",
        },
      );
      const url = `${req.protocol}://${req.get("host")}/api/v1/users/confirmEmail/${token}/user/${req.params.userId}`;
      const newUser = await User.findById(req.params.userId);
      await new Email(newUser, url).sendConfirmEmail();
      next(
        AppError(
          "Tour token has been expired! Please check your email to activate your account. .",
          401,
          err,
        ),
      );
    } else if (err.name === "JsonWebTokenError") {
      next(AppError("Invalid Token! Please login again.", 401, err));
    } else {
      next(AppError("Invalid Token! Please login again.", 401, err));
    }
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
    const user = await User.findOne({ email }).select(
      "+password +lockedUntil +status +active",
    );

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

      return next(AppError("Invalid credentials!", 400));
    }

    if (user.status === "inactive") {
      return next(
        AppError(
          "Please first confirm your email to active your account!",
          401,
        ),
      );
    }
    if (user.status === "block") {
      return next(
        AppError(
          "Your account is terminated. Please contact admin for resolving issue!",
          401,
        ),
      );
    }

    if (email in login_attempts) {
      login_attempts[email] = 0;
      user.lockedUntil = undefined;
      await user.save({ validateBeforeSave: false });
    }
    //4.Generate and send token if everything is ok
    const token = generateToken(user._id);
    const cookieOptions = {
      maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production", //So that it can  be sent on https connection
      httpOnly: true, //So that browser can not modified it
      withCredentials: true,
      sameSite: "Strict",
    };
    res.cookie("token", token, cookieOptions);
    const {
      id,
      name,
      email: userEmail,
      role,
      photo,
      imagePath,
      bookedTours,
    } = user;

    res.status(201).json({
      status: "success",
      token,
      data: { id, name, userEmail, role, photo, imagePath, bookedTours },
    });
  } catch (err) {
    return next(AppError(err.message, 404));
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie("token", {
      maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production", //So that it can only be worked on https connection
      httpOnly: true, //So that browser can not modified it
    });
    res.status(200).json({ status: "success" });
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
    } else if (req.cookies) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(
        AppError("You are not logged in! Please login to gain access!", 403),
      );
    }

    //2). Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
    await user.save({ validateBeforeSave: false });

    //4).Sending the plain token to client
    const resetURL = `${process.env.FRONTEND_ORIGIN}/resetPassword/${resetToken}`;

    try {
      await new Email(user, resetURL).sendForgotPassword();
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(AppError("Can not send email. Please try again!", 500, err));
    }

    res.status(200).json({
      status: "success",
      message:
        "An email has been sent to you. Please verify it in order to reset your password!",
    });
  } catch (err) {
    next(AppError(err.message, 404, err));
  }
}

export async function resetPassword(req, res, next) {
  try {
    //1).Convert the plain token into encrypted token for comparison

    const hashedToken = crypto
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

    res.status(200).json({
      status: "success",
      message:
        "Your password has been reset. Please login again with your new credentials!",
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
    const updatedUser = await user.save();

    //4). Generate new token and login the user rin
    const token = generateToken(user._id);

    const cookieOptions = {
      maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      // secure: process.env.NODE_ENV === "production", //So that it can only be worked on https connection
      httpOnly: true, //So that browser can not modified it
      withCredentials: true,
    };
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      status: "success",
      token,
      data: updatedUser,
    });
  } catch (err) {
    return next(AppError(err.message, 404, err));
  }
}
