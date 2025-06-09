import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

import { setupLoggin } from "./config/setup.morgan.js";
import { setupProxies } from "./config/proxy.config.js";
import { ROUTES } from "./config/routes.config.js";

dotenv.config();

const app = express();

setupLoggin(app);

app.use(cors());
app.use(express.json());

setupProxies(app, ROUTES);

const server = http.createServer(app);

server.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});
