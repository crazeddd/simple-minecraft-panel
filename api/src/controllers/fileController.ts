import { Request, Response } from "express";
import fsInit from "fs";
//import path from "path";

const fs = fsInit.promises;

var root = "/workspaces/mc-panel/test_containers";

export const readDirectory = async (req: Request, res: Response) => {
  let { path } = req.body;
  path = root + path;

  try {
    if ((await fs.lstat(path)).isDirectory()) {
      const files: string[] = await fs.readdir(path);
      res.status(200).json(JSON.stringify(files));
    } else {
      const file = fs.readFile(path);
      res.status(200).json(JSON.stringify(file));
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(JSON.stringify(`Failed to read file directory at ${path}`));
  }
};

export const readFile = async (req: Request, res: Response) => {
  const { path } = req.body;
};
