import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
  token: string | jwt.JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      const token: string = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, "superdupersecrettoken", {
        algorithms: ["HS256"],
      });

      (req as CustomRequest).body.token = decodedToken;

      next();
    } else {
      res.status(401).send({
        message: "No auth",
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).send({
        message: error,
      });
      console.log(error.message);
    }
  }
};
