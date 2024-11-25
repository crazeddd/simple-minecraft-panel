import { useState } from "react";

const apiHost = import.meta.env.VITE_API_HOST;

const handleContainers = () => {
  const [containers, appendContainers] = useState([]);

  const getContainers = () => {
    let url = `${apiHost}/container/get-containers`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((data) => appendContainers(JSON.parse(data)))
      .catch((error) => console.error("Error:", error));
  };

  const updateContainers = (type: string, id: any) => {
    let url = `${apiHost}/container/${type}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  const changeState = async (self: any) => {
    let containerId = self.currentTarget.id;
    let container = await containers.find(
      (container: any) => container.Id === containerId
    );

    if (!container) return "No such container!";

    let command = container.State === "running" ? "stop" : "start";
    updateContainers(command, containerId);
  };

  return { containers, changeState, getContainers };
};

export { handleContainers };
