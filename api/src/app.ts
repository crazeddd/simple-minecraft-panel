import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";

import dbConnect from "./db/dbConnect";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import containerRouter from "./routes/container";
import fileRouter from "./routes/files";

var app = express();

const corsConfig = {
  origin: [
    "http://localhost:3000",
    "https://glorious-cod-6wj4pj674992j55-3000.app.github.dev",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] has been sanitized`, req);
    },
  })
);

/* ROUTES */
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/container", containerRouter);
app.use("/files", fileRouter);

dbConnect();

export default app;
