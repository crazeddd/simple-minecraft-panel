import express from "express";
var router = express.Router();

import {
  stopContainer,
  startContainer,
  buildContainer,
  getContainer,
  getContainers,
} from "../controllers/containerController";

router.post("/stop", stopContainer); //Stops container

router.post("/start", startContainer); //Starts container

router.post("/get-container", getContainer); //Gets container metadata

router.get("/get-containers", getContainers); //Gets all containers metadata

//router.post("/build-container", buildContainer); //Builds new container

export default router;
