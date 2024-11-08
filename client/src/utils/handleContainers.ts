const apiHost = import.meta.env.VITE_API_HOST;

const handleContainers = () => {
  const updateContainers = (type: string, data: { id: any }) => {
    let url = `${apiHost}/container/${type}`;
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

  /*const changeState = async (self: any) => {
    let containerId = self.currentTarget.id;
    let container = containers.find(
      (container: any) => container.id === containerId
    );

    if (!container) return "No such container!";

    let command = container.state === "running" ? "stop" : "start";
    updateContainers(command, containerId);
  };*/


  //return { changeState };
};

export { handleContainers };
