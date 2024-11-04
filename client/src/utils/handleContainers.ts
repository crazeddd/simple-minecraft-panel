import { useState } from "react";

//const ws = new WebSocket("ws://localhost:8080");

const apiHost = import.meta.env.VITE_API_HOST;

const handleContainers = () => {
  const [containers, appendContainers] = useState([]);

  const updateContainers = (type: string, data: { id: any }) => {
    let url = `${apiHost}/docker/${type}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => console.log(data), appendContainers(data))
      .catch((error) => console.error("Error:", error));
  };

  /*ws.onmessage = (e) => {
  appendContainers(e.data);
  console.log(e.data);
};*/

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

export { handleContainers };
