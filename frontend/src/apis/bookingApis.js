import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { AppError } from "./AppError";

async function bookTour(tourId) {
  try {
    const stripePromise = loadStripe(
      "pk_test_51PdEyjRuF9N4LAaUyS25vEEM85avSJ9eOwGpMJK3h8TV2K0CX1DGY09GaEV7quuYiLmoYUM2pxA8yJJql3cxGLeE00RTq9sT6w"
    );
    const res = await axios.get(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`,
      { withCredentials: true }
    );
    const session = res.data.session;
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  } catch (error) {
    AppError(error);
  }
}

async function saveBooking(userId, tourId, price) {
  try {
    const res = await axios.post(
      `http://localhost:3000/api/v1/Bookings/saveBooking`,
      { tourId, userId, price },
      { withCredentials: true }
    );
    const res2 = await axios.get("http://localhost:3000/api/v1/users/getMe", {
      withCredentials: true,
    });
    localStorage.setItem("user", JSON.stringify(res2.data.docs));

    return res;
  } catch (error) {
    return error;
  }
}

async function myBookings() {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/v1/Bookings/myBookings`,

      { withCredentials: true }
    );

    return res.data.tours;
  } catch (error) {
    AppError(error);
  }
}

async function getAllBookings(page) {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/v1/Bookings/?page=${page}`,

      { withCredentials: true }
    );
    const totalBookings = res.data.totalDocs;
    const bookings = res.data.data;
    const data = { totalBookings, bookings };
    return data;
  } catch (error) {
    AppError(error);
  }
}

async function deleteBookingApi(id) {
  try {
    const res = await axios.delete(
      `http://localhost:3000/api/v1/Bookings/${id}`,

      { withCredentials: true }
    );

    return res;
  } catch (error) {
    AppError(error);
  }
}

async function createBookingApi(data) {
  try {
    const res = await axios.post(
      `http://localhost:3000/api/v1/Bookings/`,
      data,

      { withCredentials: true }
    );

    return res;
  } catch (error) {
    AppError(error);
  }
}
export {
  bookTour,
  saveBooking,
  myBookings,
  getAllBookings,
  deleteBookingApi,
  createBookingApi,
};
