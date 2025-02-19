import type { Request, Response } from "express";
import Docker from "dockerode";
import Container from "../db/containerModel";

var docker = new Docker();

const getServerIp = async () => {
  const res = await fetch("https://ipinfo.io/ip", { method: "GET" });
  return (await res.blob()).text();
};

const serverIp = await getServerIp();

export const stopContainer = async (req: Request, res: Response) => {
  const { id } = req.body;
  const container = docker.getContainer(id);
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
  const { id } = req.body;
  const container = docker.getContainer(id);
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
  const userId = req.body.token.userId;
  const containers: any[] = [];
  try {
    const userContainerList = await Container.find({ owner_id: userId });

    const containerPromises = userContainerList.map(async (userContainer) => {
      try {
        const container = docker.getContainer(userContainer.id);
        const containerInfo = await container.inspect();
        return {
          Id: containerInfo.Id,
          Image: `${serverIp}:443`,
          Name: containerInfo.Name,
          State: containerInfo.State.Status,
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
        }
      }
    });
    const resolvedContainers = await Promise.all(containerPromises);
    containers.push(...resolvedContainers);

    res.status(200).send(JSON.stringify(containers));
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send("Failed to fetch containers");
      console.error("Error retrieving containers:", error);
    }
  }
};

export const createContainer = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    for (let input in data) {
      if (!input) {
        throw new Error("Please fill out all the inputs");
      }
    }

    const findUnallocatedPort = async () => {
      const rangeMax = 20000;
      const rangeMin = 10000;
      const intervalAmount = 10000;

      const docCount = await Container.countDocuments();

      for (let i = 0; i < intervalAmount; i++) {
        const port: number = Math.floor(Math.random() * rangeMax) + rangeMin;
        for (let i = -1; i < docCount; i++) {
          const res = await Container.exists({ port: port });
          if (!res) return port;
        }
      }
    };

    const port = await findUnallocatedPort();

    const containerConfig = {
      Image: "itzg/minecraft-server",
      name: data.name,
      tty: true,
      stdin: true,
      ExposedPorts: {
        [`${port}/tcp`]: {},
      },
      HostConfig: {
        PortBindings: {
          [`${port}/tcp`]: [{ HostPort: port?.toString() }],
        },
      },
      Env: [
        `VERSION=${data.version}`,
        `MEMORY=${data.max_ram}G`,
        `TYPE=${data.type}`,
        "EULA=TRUE",
      ],
    };

    console.log(containerConfig);

    const container = await docker.createContainer(containerConfig);

    const newContainer = new Container({
      owner_id: data.token.userId,
      id: container.id,
      port: port,
      max_ram: data.max_ram,
      max_cpu: data.max_cpu,
    });

    await newContainer.save();

    res.status(200).json(`Created new container ${req.body.name}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
      console.error(error.message);
    }
  }
};
