import { AppError } from "./AppError";
import { api } from "./baseApiURL";

async function createReview({ tourId, data }) {
  try {
    const res = await api.post(`/tours/${tourId}/reviews`, data, {
      withCredentials: true,
    });
    return res.data.docs;
  } catch (error) {
    AppError(error);
  }
}
async function getAllUserReviews(userId) {
  try {
    const res = await api.get(
      `/users/${userId}/reviews`,

      { withCredentials: true }
    );
    return res.data.data;
  } catch (error) {
    AppError(error);
  }
}

async function getAllReviews(page) {
  try {
    let url = `/reviews?`;
    if (page) {
      url = url + `page=${page}`;
    }
    const res = await api.get(
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
    const res = await api.delete(
      `/reviews/${reviewId}`,

      { withCredentials: true }
    );
    return res;
  } catch (error) {
    AppError(error);
  }
}
async function updateReviewApi({ id, data }) {
  try {
    const res = await api.patch(`/reviews/${id}`, data, {
      withCredentials: true,
    });
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
