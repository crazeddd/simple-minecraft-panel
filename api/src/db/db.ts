import Database from "better-sqlite3";
import fs from "fs";

const path = "./main.db"

const dbConnect = () => {
    try {
        if (fs.existsSync(path)) {
            return new Database(path);
        } else {
            const db = new Database(path, { verbose: console.log });
            createUserSchema(db);

            db.pragma('journal_mode = WAL');
            console.log("Connected to db!");

            return db;
        }
    } catch (err) { console.error("Failed to connect to db!", err) };
}

const createUserSchema = (db: any) => {
    db.exec(`
        CREATE TABLE users
        (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          username VARCHAR(50) NOT NULL,
          password VARCHAR(50) NOT NULL,
        );
    `);
}

export { dbConnect };