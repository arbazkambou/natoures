# Natours

Natours is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to browse and book nature tours, providing a seamless and interactive user experience.

[Deployed Project Link](https://natoures.vercel.app/)

## Overview

This web application enables users to book nature tours.

A tour consists of a series of curated locations designed to thrill and engage the adventurous spirit of the traveler.

Visitors to the site, even without an account, can browse all available tours and view detailed information about each one.

After signing up or logging in, users can book any tour they are interested in.

Users can leave a single review for each tour they have booked.

## Purpose

This application was developed as a personal project to enhance my skills in full stack web development.

## Main Tools and Technologies Used

- **React** (Frontend library for adding interactivity and handling client-side logic)
- **HTML** (Structuring the content of the web pages)
- **CSS** (Styling the web pages)
- **Tailwind CSS** (Styling the web pages)
- **Shadcn/ui** (3rd party component library)
- **Node.js** (Running JavaScript code on the server-side)
- **Express.js** (Framework for building server-side applications with Node.js)
- **MongoDB** (Database for storing and managing data)
- **Mongoose** (Object Data Modeling (ODM) library for MongoDB and Node.js)
- **Stripe** (Handling payments and transactions)
- **JSON Web Token (JWT)** (Authenticating users and managing sessions)
- **Nodemailer** (Sending emails from the server)
- **Mailtrap** (Testing email sending in the development environment)
- **BREVO** (Sending emails in production)

## Main Features

- [Users](#users)
- [Tours](#tours)
- [Bookings](#bookings)
- [Reviews](#reviews)
- [Note](#note)

## Users

- A user can be either a regular user or an admin or a lead-guide or a guide.
- When you sign up, you are a regular user by default.
- Users can sign up with the application.
- Users can log into the application.
- Users can log out of the appication.
- Users can update their password.
- Users can reset their password
- Users can update their general information.
- Users can see their profile page.
- Admin can block, active or inactive the user.
- Admin can update and delete the users.

## Bookings

- Only logged in users can book tours by making payment.
- Users can not book the same tour twice.
- Regular users can see all the tours thay have booked.
- An admin or a lead-guide can see all the bookings made by users.
- An admin or a lead-guide can delete any booking.
- An admin or a lead-guide can create a booking (manually, without payment).
- An admin or a lead-guide can edit any booking.

## Tours

- An admin or a lead-guide can create new tour.
- An admin or a lead-guide can update tour.
- An admin or a lead-guide can delete tour.
- A user can only see and book tour.

## Reviews

- Only users can write reviews for tours which they have booked.
- Users can edit and delete their own reviews.
- Users can not review the same tour twice.
- All users can see the reviews of each tour.
- An admin can delete and update any review.

## Note

The app is actually quite more complex than is indicated in this documentation. Nevertheless, this summary is enough to help you understand the major features of the app. You are welcome to make improvements on the app. Please use the link specified at the beginning of the document to preview the app.

## Contact

Arbaz Shoukat - [arbazkambo342@gmail.com](mailto:arbazkambo342@gmail.com)

Project Link: [https://github.com/arbazkambou/natours](https://github.com/arbazkambou/natours)
