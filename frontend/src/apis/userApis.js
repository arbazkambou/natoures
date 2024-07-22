import { AppError } from "./AppError";
import { api } from "./baseApiURL";

async function updateMe(data) {
  try {
    let res;
    if (!data.password) {
      res = await api.patch("/users/updateMe", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
    } else {
      res = await api.patch("/users/updatePassword", data, {
        withCredentials: true,
      });
    }
    // console.log(data);

    return res.data.data;
  } catch (error) {
    AppError(error);
  }
}

async function getAllUsers(page, role, status) {
  try {
    let url = `/users/?`;

    if (page) {
      url = url + `page=${page}&`;
    }

    if (role) {
      url = url + `role=${role}&`;
    }
    if (status) {
      url = url + `status=${status}&`;
    }

    const res = await api.get(
      url,

      {
        withCredentials: true,
      }
    );

    const users = res.data.data;
    const totalUsers = res.data.totalDocs;
    const data = { users, totalUsers };
    return data;
  } catch (error) {
    AppError(error);
  }
}

async function updateUserApi({ data, id }) {
  try {
    const res = await api.patch(`/users/${id}`, data, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    AppError(error);
  }
}
async function deleteUserApi(id) {
  try {
    const res = await api.delete(`/users/${id}`, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    AppError(error);
  }
}

export { updateMe, getAllUsers, updateUserApi, deleteUserApi };
