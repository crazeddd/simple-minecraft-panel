import { Request, Response } from "express";
import Docker from "dockerode";

import wss from "../websocket/containerWebsocket";

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
    //Attempts to start container
    if (error) {
      res.status(500).json(`Failed to start container ${id}`);
      console.error(`Error when starting ${id} (${error})`);
    } else {
      res.status(200).json(`Successfully started container ${id}`);
      console.log(`Successfully started ${id}`);
    }
  });
};

export const getContainers = async () => {
  let containers: any[] = [];
  try {
    const containerList = await docker.listContainers({ all: true });

    for (const containerInfo of containerList) {
      let container = {
        id: containerInfo.Id,
        image: containerInfo.Image,
        names: containerInfo.Names,
        state: containerInfo.State,
      };

      containers.push(container);
    }
    console.log(containers);
    return containers;
  } catch (err) {
    return console.error("Error processing containers:", err);
  }
}

wss.on("connection", (ws: any) => {
  console.log("Established connection");
  ws.send("Sucessfully connected to socket");
  const sendLoop = () => {
    wss.clients.forEach(async (client: any) => {
      let data = await getContainers();
      client.send(JSON.stringify(data));
    })
  }
  setInterval(sendLoop, 1000);
})


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

//FOR TESTING
/*async function removeStoppedContainers() {
    const containers = await docker.listContainers({ all: true });
    for (const containerInfo of containers) {
        if (containerInfo.State === 'exited') {
            const container = docker.getContainer(containerInfo.Id);
            try {
                await container.remove();
                console.log(`Removed container: ${containerInfo.Names[0]}`);
            } catch (err) {
                console.error(`Error removing container: ${containerInfo.Names[0]}`, err);
            }
        }
    }
}*/