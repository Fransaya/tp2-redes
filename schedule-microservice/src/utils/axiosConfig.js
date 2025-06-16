import axios from "axios";

export const axiosUserMicroservice = axios.create({
  baseURL: process.env.USER_MICROSERVICE_URL || "http://localhost:3001/user",
  timeout: 5000, // Set a timeout of 5 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosEventMicroservice = axios.create({
  baseURL: process.env.EVENT_MICROSERVICE_URL || "http://localhost:3002/event",
  timeout: 5000, // Set a timeout of 5 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosAuthMicroservice = axios.create({
  baseURL: process.env.AUTH_MICROSERVICE_URL || "http://localhost:3001/auth",
  timeout: 5000, // Set a timeout of 5 seconds
  headers: {
    "Content-Type": "application/json",
  },
});
