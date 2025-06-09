import axios from "axios";

export const axiosUserMicroservice = axios.create({
  baseURL: process.env.USER_MICROSERVICE_URL || "http://localhost:3000",
  timeout: 5000, // Set a timeout of 5 seconds
  headers: {
    "Content-Type": "application/json",
  },
});
