import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../db/userModel";

export const createAccount = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let hashPassword = async () => {
      if (password) {
        return await bcrypt.hash(password, 14).catch((error: any) => {
          res.status(500).send({
            message: "Error hashing password",
            error,
          });
        });
      } else {
        return req.body.password; //Returns empty password, passes to mongoDB which throws error; might change later
      }
    };

    const hashedPassword = await hashPassword();

    const user = new User({
      username: username,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send({
      message: "Successfully created new account",
    });
  } catch (error: any) {
    let errorMessage = "Failed to create new account";

    switch (error.code) {
      case 11000:
        // Duplicate key error
        errorMessage = "Account already exists";
        break;

      case 121:
        // Document failed validation
        errorMessage = "Document validation failed";
        break;

      default:
        if (error.errors) {
          if (error.errors.username && error.errors.username.name) {
            errorMessage = "Username Required";
          } else if (error.errors.password && error.errors.password.name) {
            errorMessage = "Password Required";
          }
        }
        break;
    }

    res.status(500).send({
      message: errorMessage,
    });
    console.log(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("Account does not exist");
    }
    await bcrypt.compare(password, user.password).catch((error: any) => {
      throw new Error("Incorrect password");
    });

    const token: {} = jwt.sign(
      {
        userId: user._id,
        userName: user.username,
      },
      "superdupersecrettoken",
      {
        algorithm: "HS256",
        expiresIn: "24h",
      }
    );

    res.status(200).send({
      message: "Succesfully logged in",
      token,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({
        message: error.message,
      });
      console.error(error.message);
    }
    console.error("An unknown error has occured")
  }
};
