import { useState } from "react";

const apiHost = import.meta.env.VITE_API_HOST;

const ws = new WebSocket("wss://glorious-cod-6wj4pj674992j55-2400.app.github.dev");

const handleContainers = () => {
  const [containers, appendContainers] = useState([]);

  ws.onmessage = (e) => {
    appendContainers(JSON.parse(e.data));
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
    let container = containers.find(
      (container: any) => container.id === containerId
    );

    if (!container) return "No such container!";

    let command = container.state === "running" ? "stop" : "start";
    updateContainers(command, containerId);
  };

  return { containers, changeState };
};

export { handleContainers, ws };
