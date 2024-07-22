import { AppError } from "./AppError";
import { api } from "./baseApiURL";

async function loginApi(data) {
  try {
    const res = await api.post("/users/login", data, {
      withCredentials: true,
    });

    const {
      id,
      name,
      userEmail: email,
      role,
      photo,
      imagePath,
      bookedTours,
    } = res.data.data;
    const userData = { id, name, email, role, photo, imagePath, bookedTours };
    return userData;
  } catch (error) {
    AppError(error);
  }
}

async function logoutApi() {
  try {
    const res = await api.delete("/users/logout", {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    AppError(error);
  }
}

async function signupApi(data) {
  try {
    const res = await api.post("/users/signup", data);
    return res.data.message;
  } catch (error) {
    AppError(error);
  }
}

async function forgotPasswordApi(data) {
  try {
    const res = await api.post("/users/forgotPassword", data);
    return res.data.message;
  } catch (error) {
    AppError(error);
  }
}

async function resetPasswordApi({ resetToken, data }) {
  try {
    const res = await api.post(`/users/resetPassword/${resetToken}`, data);
    return res.data.message;
  } catch (error) {
    AppError(error);
  }
}
export { loginApi, logoutApi, signupApi, forgotPasswordApi, resetPasswordApi };
