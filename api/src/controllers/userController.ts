import { Request, Response } from "express";
import { dbConnect } from "../db/db"

const db: any = dbConnect();

export const signUp = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = db.prepare(`INSERT INTO users (username, password) VALUES (@username, @password)`);
        user.run(username, password);

        console.log(`Created new user ${username}!`)
    } catch (err) {
        console.error("Failed to create new user", err);
    }
}

export const logIn = async (req: Request, res: Response) => {
    
}