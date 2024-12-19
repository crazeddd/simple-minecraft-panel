import express from "express";
var router = express.Router();

import { readDirectory } from "../controllers/fileController";

router.post("/read-dir", readDirectory); //Reads container directory 

export default router;
