import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import containerRouter from "./routes/container";

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //URL encoding
app.use(cookieParser());
app.use(express.static("public")); //Serve static files

const corsConfig = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsConfig));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/docker", containerRouter);

export default app;

