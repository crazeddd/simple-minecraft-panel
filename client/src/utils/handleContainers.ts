import { useState } from "react";

const apiHost = import.meta.env.VITE_API_HOST;

const handleContainers = () => {
  const [containers, setContainers] = useState([]);

  const getContainers = async () => {
    const token = localStorage.getItem("token");
    const url = `${apiHost}/container/get-containers`;

    try {
      const res = fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await (await res).json();
      setContainers(data);
    } catch (error) {
      console.error("Failed to get containers:", error);
    }
  };

  const updateContainers = async (type: string, id: string) => {
    const url = `${apiHost}/container/${type}`;

    try {
      const res = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await (await res).json();
      console.log(data);
    } catch (error: unknown) {
      console.error("Failed to update container state");
    }
  };

  const changeState = async (self: any, state: string) => {
    const id = self.currentTarget.id;
    const command = state === "running" ? "stop" : "start";
    updateContainers(command, id);
  };

  return { containers, changeState, getContainers };
};

export { handleContainers };
