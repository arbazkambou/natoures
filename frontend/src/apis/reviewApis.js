import axios from "axios";
import { AppError } from "./AppError";

async function createReview({ tourId, data }) {
  try {
    const res = await axios.post(
      `http://localhost:3000/api/v1/tours/${tourId}/reviews`,
      data,
      { withCredentials: true }
    );
    return res.data.docs;
  } catch (error) {
    AppError(error);
  }
}
async function getAllUserReviews(userId) {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/v1/users/${userId}/reviews`,

      { withCredentials: true }
    );
    return res.data.data;
  } catch (error) {
    AppError(error);
  }
}

async function getAllReviews(page) {
  try {
    let url = `http://localhost:3000/api/v1/reviews?`;
    if (page) {
      url = url + `page=${page}`;
    }
    const res = await axios.get(
      url,

      { withCredentials: true }
    );

    const reviews = res.data.data;
    const totalReviews = res.data.totalDocs;
    const data = { reviews, totalReviews };

    return data;
  } catch (error) {
    AppError(error);
  }
}

async function deleteReviewApi(reviewId) {
  try {
    const res = await axios.delete(
      `http://localhost:3000/api/v1/reviews/${reviewId}`,

      { withCredentials: true }
    );
    return res;
  } catch (error) {
    AppError(error);
  }
}
async function updateReviewApi({ id, data }) {
  try {
    const res = await axios.patch(
      `http://localhost:3000/api/v1/reviews/${id}`,
      data,
      { withCredentials: true }
    );
    return res;
  } catch (error) {
    AppError(error);
  }
}

export {
  createReview,
  getAllUserReviews,
  deleteReviewApi,
  updateReviewApi,
  getAllReviews,
};
