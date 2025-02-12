import type { Request, Response } from "express";
import Docker from "dockerode";
import Container from "../db/containerModel";
import { userInfo } from "os";

var docker = new Docker();

export const stopContainer = async (req: Request, res: Response) => {
  let { id } = req.body;
  let container = docker.getContainer(id);
  container.stop((error: string) => {
    if (error) {
      res.status(500).json(`Failed to stop container ${id}`);
      console.error(`Error when stopping ${id} (${error})`);
    } else {
      res.status(200).json(`Successfully stopped container ${id}`);
      console.log(`Successfully stopped ${id}`);
    }
  });
};

export const startContainer = async (req: Request, res: Response) => {
  let { id } = req.body;
  let container = docker.getContainer(id);
  container.start((error: string) => {
    if (error) {
      res.status(500).json(`Failed to start container ${id}`);
      console.error(`Error when starting ${id} (${error})`);
    } else {
      res.status(200).json(`Successfully started container ${id}`);
      console.log(`Successfully started ${id}`);
    }
  });
};

//General data for containers that doesnt need to be polled (ex. Name, Id)
export const getContainers = async (req: Request, res: Response) => {
  let containers: any[] = [];
  try {
    const containerList = await docker.listContainers({ all: true });

    for (const containerInfo of containerList) {
      let container = {
        Id: containerInfo.Id,
        Image: containerInfo.Image,
        Names: containerInfo.Names,
        State: containerInfo.State,
      };

      containers.push(container);
    }
    res.status(200).send(JSON.stringify(containers));
  } catch (err) {
    res.status(500).send(`Error getting containers}`);
    console.error("Error processing container:", err);
  }
};

export const createContainer = async (req: Request, res: Response) => {
  try {
    for (let input in req.body) {
      if (input == null) {
        throw new Error("Please fill out all the inputs");
      }
    }

    const containerConfig = {
      Image: req.body.image,
      name: req.body.name,
      ExposedPorts: {
        [`${req.body.port}/${req.body.protocol}`]: {},
      },
      HostConfig: {
        PortBindings: {
          [`${req.body.port}/${req.body.protocol}`]: [
            { HostPort: req.body.host_port },
          ],
        },
      },
      Env: [`VERSION=${req.body.version}`, req.body.env],
    };

    console.log(containerConfig);

    docker.createContainer(
      containerConfig,
      async (error: string, container: any) => {
        if (error) {
          throw new Error(`Failed to create container ${error}`);
        }

        const newContainer = new Container({
          owner_id: req.body.token.userId,
          id: container.id,
        });

        await newContainer.save();
      }
    );

    res.status(200).send(`Created new container ${req.body.name}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
      console.error(error.message);
    }
  }
};
