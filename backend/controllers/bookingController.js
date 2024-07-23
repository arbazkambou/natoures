import Stripe from "stripe";
import { AppError } from "../helper/AppError.js";
import Tour from "../models/tourModels.js";
import Booking from "../models/bookingModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.js";

async function getCheckoutSession(req, res, next) {
  try {
    //Check if user already booked that tour
    const booking = await Booking.findOne({
      tour: req.params.tourId,
      user: req.user.id,
    });

    if (booking) {
      return next(AppError("You have already booked that tour!", 401));
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    //1). Get the currently booked tour from database
    const tour = await Tour.findById(req.params.tourId);
    // console.log(process.env.STRIPE_SECRET_KEY);
    //2). Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_ORIGIN}/tour/${req.params.tourId}/user/${req.user.id}/price/${tour.price}`,
      cancel_url: `${process.env.FRONTEND_ORIGIN}/tour-detail/${tour.id}`,
      customer_email: req.user.email,
      client_reference_id: req.params.id,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [
                `${process.env.BACKEND_ORIGIN}/public/img/tours/${tour.imageCover}`,
              ],
            },
            unit_amount: tour.price * 100,
          },
          quantity: 1,
        },
      ],
    });

    //3). Create session as response
    res.status(200).json({ status: "success", session });
  } catch (error) {
    return next(AppError(error.message, 404, error));
  }
}

async function stripeWebhookMiddleware(req, res, next) {
  const sig = req.headers["Stripe-Signature"];
  console.log("sig", sig);
  console.log("body", req.body);
  console.log("secret", process.env.STRIPE_WEBHOOK_SECRET);
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true, data: event.data.object });
}

async function saveBooking(req, res, next) {
  try {
    const { tourId, userId, price } = req.body;
    await Booking.create({
      tour: tourId,
      user: userId,
      price: price,
    });
    res.status(200).json({ status: "Ok" });
  } catch (error) {
    return next(AppError(error.message, 404, error));
  }
}

async function myBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    const tourIds = bookings.map((booking) => booking.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });
    res.status(200).json({ status: "success", tours });
  } catch (error) {
    return next(AppError(error.message, 404, error));
  }
}

const getBooking = getOne(Booking);
const getAllBookings = getAll(Booking);
const updateBooking = updateOne(Booking);
const deleteBooking = deleteOne(Booking);

const createBooking = createOne(Booking);

export {
  getCheckoutSession,
  saveBooking,
  myBookings,
  getBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
  createBooking,
  stripeWebhookMiddleware,
};
