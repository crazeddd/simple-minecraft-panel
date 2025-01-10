import { WebSocketServer } from "ws";
import Docker from "dockerode";

var docker = new Docker();

const dockerWss = new WebSocketServer({ port: 2401 });

dockerWss.on("connection", (ws) => {
  console.log("Connected to client");

  ws.on("message", async (e: Buffer) => {
    try {
      const id = JSON.parse(e.toString());
      console.log(id);
      const container = docker.getContainer(id);

      const logStream = await container.attach({
        stream: true,
        stdout: true,
        stderr: true,
        stdin: true,
        logs: true,
      });

      const statsPoll = setInterval(async () => {
        const stats = await container.stats({ stream: false });
        ws.send(JSON.stringify({ type: "stats", data: stats }));
      }, 1000);

      console.log(`Established data stream to ${id}`);

      logStream.on("data", (data: Buffer) => {

        ws.send(JSON.stringify({ type: "log", data: data.toString()}));
      });

      ws.onclose = () => {
        logStream.end();
        clearInterval(statsPoll);
      };
    } catch (err) {
      console.error("Error: ", err);
    }
  });
});

export { dockerWss };
