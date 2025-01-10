import express from "express";
var router = express.Router();

import {
  stopContainer,
  startContainer,
  buildContainer,
  getContainers,
} from "../controllers/containerController";

router.post("/stop", stopContainer); //Stops container

router.post("/start", startContainer); //Starts container

router.get("/get-containers", getContainers); //Gets all containers basic metadata

//router.post("/build-container", buildContainer); //Builds new container

export default router;
