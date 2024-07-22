import axios from "axios";
import { AppError } from "./AppError";

async function loginApi(data) {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/v1/users/login",
      data,
      {
        withCredentials: true,
      }
    );

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
    const res = await axios.delete(
      "http://localhost:3000/api/v1/users/logout",
      {
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    AppError(error);
  }
}

async function signupApi(data) {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/v1/users/signup",
      data
    );
    return res.data.message;
  } catch (error) {
    AppError(error);
  }
}
export { loginApi, logoutApi, signupApi };
