import { useState } from "react";
const ws = new WebSocket("ws://localhost:8080");

const apiHost = import.meta.env.VITE_API_HOST;

export const [containers, appendContainers] = useState([]);

export const updateContainers = (type: string, data: { id: any }) => {
  let url = `${apiHost}/docker/${type}`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
};

ws.onmessage = (e) => {
  appendContainers(e.data);
  console.log(e.data);
};

export const changeState = async (self: any) => {
  const getStateById = (containers: any[], id: number) => {
    var container = containers.find(function (obj: any) {
      return obj.id === id;
    });
    return container ? container.state : null;
  };

  let containerId = self.currentTarget.id;
  let containerState = getStateById(containers, containerId);
  //let data = { id: containerId };

  if (containerState == "running") {
    updateContainers("stop", containerId);
  } else {
    updateContainers("start", containerId);
  }
};
