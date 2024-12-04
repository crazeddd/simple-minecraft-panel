import { Request, Response } from "express";
import Docker from "dockerode";

import { wss } from "../websocket/containerWebsocket";

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

export const getContainer = async (req: Request, res: Response) => {
  let { id } = req.body;
  const container = docker.getContainer(id);

  try {
    const containerStats = await container.stats({ stream: false });
    const containerInfo = await container.inspect();
    let containerData = {
      /*Id: container.Id,
      Image: container.Image,
      Names: container.Names,
      State: container.State,
      max_usage: stats.memory_stats.max_usage,
      usage: stats.memory_stats.usage*/
      info: containerInfo,
      stats: containerStats,
      State: containerInfo.State.Status,
      Id: containerInfo.Id
    };

    res.status(200).json(JSON.stringify(containerData));
  } catch (err) {
    res.status(500).json(`Error getting container ${id}`);
    console.error("Error processing container:", err);
  }
}

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
    res.status(200).json(JSON.stringify(containers));
  } catch (err) {
    res.status(500).json(`Error getting containers}`);
    console.error("Error processing container:", err);
  }
}

wss.on('connection', (ws) => {
  console.log("Connected to client");
  ws.on("message", (e) => {
    try {
      console.log(e);
      const { id } = JSON.parse(e.toString());
      const container = docker.getContainer(id);

      console.log(`Established stream to ${id}`)

      container.attach({
        stream: true, stdout: true, stderr: true, stdin: true, logs: false
      }, function (error, stream) {
        if (error) {
          console.error("Error when attaching:", error);
        }
        if (stream) {
          stream.on("data", (data) => {
            console.log(data.toString());
            ws.send(data.toString());
          })
          stream.on("end", () => {
            console.log(`Closing stream to ${id}`);
            ws.send("Closing RCON connection...");
          })
          ws.onclose = () => {
            console.log(`Closing stream to ${id}`);
            ws.send("Closing RCON connection...");
            stream.end();
          }
        } else {
          console.error("No stream exists, cannot pipe data!")
        }
      })
    } catch (error) {
      console.error("Error: ", error);
    }
  })
});


export const buildContainer = async (req: Request, res: Response) => {
  for (let input in req.body) {
    if (input == null) {
      return res.status(500).json("Please fill out all the inputs");
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

  docker.createContainer(containerConfig, (error: string, container: any) => {
    if (error) {
      res.status(500).json(`Failed to create container ${error}`);
      console.error(`Error creating container: ${error}`);
    } else {
      container.start((error: string) => {
        if (error) {
          console.error("Error starting container: ", error);
        } else {
          res
            .status(200)
            .json(`Container ${container} created and started successfully!`);
          console.log(
            `Container ${container} created and started successfully!`
          );
        }
      });
    }
  });
};