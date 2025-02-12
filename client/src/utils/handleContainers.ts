import { useState } from "react";

const apiHost = import.meta.env.VITE_API_HOST;

const handleContainers = () => {
  const [containers, setContainers] = useState([]);

  const getContainers = async () => {
    const url = `${apiHost}/container/get-containers`;

    try {
      const res = fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await (await res).json();
      setContainers(data);
    } catch (err) {
      console.error("Error:", err);
    }
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
      .catch((err) => console.error("Error:", err));
  };

  const changeState = async (self: any, state: string) => {
    const id = self.currentTarget.id;
    const command = state === "running" ? "stop" : "start";
    updateContainers(command, id);
  };

  return { containers, changeState, getContainers };
};

export { handleContainers };
