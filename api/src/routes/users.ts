import express from "express";
var router = express.Router();

import {
  signUp
} from "../controllers/userController";

router.post("/signup", signUp); //Creates new user


export default router;