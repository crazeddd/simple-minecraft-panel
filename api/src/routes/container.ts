import express from "express";
var router = express.Router();

import {
  stopContainer,
  startContainer,
  buildContainer,
  refreshContainers,
} from "../controllers/containerController";

router.post("/stop", stopContainer); //Stops container

router.post("/start", startContainer); //Starts container

router.post("/build-container", buildContainer); //Builds new container

router.get("/refresh", refreshContainers); //Refreshs containers

export default router;
