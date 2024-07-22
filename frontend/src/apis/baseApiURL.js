import axios from "axios";

const api = axios.create({
  baseURL: "https://natoures.onrender.com/api/v1", // replace with your base URL
});

const toursImages = "https://natoures.onrender.com/public/img/tours/";
const usersImages = "https://natoures.onrender.com/public/img/users/";

export { api, toursImages, usersImages };
