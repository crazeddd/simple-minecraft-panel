import { Request, Response } from "express";
import fsInit from "fs";
//import path from "path";

const fs = fsInit.promises;

var root = ".";

export const readDirectory = async (req: Request, res: Response) => {
  const { path } = req.body;
  let containerPath: string = root;
  if (path) containerPath += path, console.log(containerPath);

  try {
    if ((await fs.lstat(containerPath)).isDirectory()) {
      const files: string[] = await fs.readdir(containerPath);
      res.status(200).json(JSON.stringify(files));
    } else {
      const file = fs.readFile(containerPath);
      res.status(200).json(JSON.stringify(file));
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(JSON.stringify(`Failed to read file directory at ${containerPath}`));
  }
};
