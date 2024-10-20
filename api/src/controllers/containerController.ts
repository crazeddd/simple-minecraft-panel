import { Request, Response } from "express";
import Docker from "dockerode";

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

export const refreshContainers = async (req: Request, res: Response) => {
  let containers: any[] = [];
  try {
    const containerList = await docker.listContainers({ all: true }); //Grabs a list of all running containers

    for (const containerInfo of containerList) {
      //For each container found
      let container = {
        //Gets container id, image, names, and state
        id: containerInfo.Id,
        image: containerInfo.Image,
        names: containerInfo.Names,
        state: containerInfo.State,
      };

      containers.push(container);
    }
    res.json(containers);
  } catch (err) {
    console.error("Error processing containers:", err);
    res.status(500).json("Error processing containers");
  }
};

export const buildContainer = async (req: Request, res: Response) => {
  for (let input in req.body) {
    if (input == null) {
      return res.status(500).json("Please fill out all the inputs");
    }
  }
  const containerConfig = {
    //Creates container config based on user inputs
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
    Env: [req.body.env],
  };

  console.log(containerConfig);

  docker.createContainer(containerConfig, (error: string, container: any) => {
    //Attempts to create container
    if (error) {
      res.status(500).json(`Failed to create container ${error}`);
      console.error(`Error creating container: ${error}`);
    } else {
      container.start((error: string) => {
        //After successfully creating container attempts to start container
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