import { AppError } from "./AppError";
import { api } from "./baseApiURL";

async function getTours() {
  try {
    const res = await api.get("/tours", {
      withCredentials: true,
    });
    const tours = res.data.data;
    const totalTours = res.data.totalDocs;
    const data = { tours, totalTours };
    return data;
  } catch (error) {
    AppError(error);
  }
}

async function getTour(tourId) {
  try {
    const res = await api.get(`/tours/${tourId}`, { withCredentials: true });

    return res.data.docs;
  } catch (error) {
    AppError(error);
  }
}

async function createTourApi(data) {
  try {
    const res = await api.post("/tours", data, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    AppError(error);
  }
}

async function updateTourApi({ id, formData }) {
  try {
    const res = await api.patch(`/tours/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    AppError(error);
  }
}

async function deleteTourApi(id) {
  try {
    const res = await api.delete(
      `/tours/${id}`,

      {
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    AppError(error);
  }
}

export { getTours, getTour, createTourApi, updateTourApi, deleteTourApi };
