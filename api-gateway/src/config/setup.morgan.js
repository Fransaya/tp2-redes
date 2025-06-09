import morgan from "morgan";

export const setupLoggin = (app) => {
  app.use(morgan("combined"));
};
