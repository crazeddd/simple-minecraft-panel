import express from "express";
import { auth } from "../utils/auth";
var router = express.Router();

import {
  stopContainer,
  startContainer,
  createContainer,
  getContainers,
} from "../controllers/containerController";

router.post("/stop", stopContainer); //Stops container

router.post("/start", startContainer); //Starts container

router.get("/get-containers", auth, getContainers); //Gets all containers basic metadata

router.post("/create-container", auth, createContainer); //Builds new container

export default router;
