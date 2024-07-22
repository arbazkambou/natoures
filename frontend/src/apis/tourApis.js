import axios from "axios";
import { AppError } from "./AppError";

async function getTours() {
  try {
    const res = await axios.get("http://localhost:3000/api/v1/tours", {
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
    const res = await axios.get(
      `http://localhost:3000/api/v1/tours/${tourId}`,
      { withCredentials: true }
    );

    return res.data.docs;
  } catch (error) {
    AppError(error);
  }
}

const fetchUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error.message);
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};

async function createTourApi(data) {
  try {
    const res = await axios.post("http://localhost:3000/api/v1/tours", data, {
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
    const res = await axios.patch(
      `http://localhost:3000/api/v1/tours/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    AppError(error);
  }
}

async function deleteTourApi(id) {
  try {
    const res = await axios.delete(
      `http://localhost:3000/api/v1/tours/${id}`,

      {
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    AppError(error);
  }
}

export {
  getTours,
  getTour,
  fetchUserLocation,
  createTourApi,
  updateTourApi,
  deleteTourApi,
};
