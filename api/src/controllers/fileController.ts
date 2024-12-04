import { Request, Response } from "express";
import Docker from "dockerode";
import fs1 from "fs";
import path from "path";

const fs = fs1.promises;

var root = "../../../dockermc";

export const readDirectory = async (req: Request, res: Response) => {
  //const { id } = req.body;
  const containerDir = root + "/test";

  try {
    const files = await fs.readdir(containerDir);
    const fileList = files.map((file) => file);
    res.status(200).json(JSON.stringify(fileList));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(JSON.stringify(`Failed to read file directory at ${path}`));
  }
};
