import { WebSocketServer } from "ws";
import Docker from "dockerode";

const docker = new Docker();
const dockerWss = new WebSocketServer({ port: 2401 });

const containerStreams = new Map();

dockerWss.on("connection", (ws) => {
  console.log("Connected to client");

  ws.on("message", async (e) => {
    try {
      const data = JSON.parse(e.toString());

      if (data.type === "connect") {
        if (data.auth) {

        }
        const container = docker.getContainer(data.message);

        const containerStream = await container.attach({
          stream: true,
          stdout: true,
          //hijack: true,
          //stdin: true,
          //stderr: true,
          logs: true,
        });

        containerStreams.set(ws, containerStream);

        const statsPoll = setInterval(async () => {
          const stats = await container.stats({ stream: false });
          ws.send(JSON.stringify({ type: "stats", data: stats }));
        }, 1000);

        console.log(`Established data stream to ${data.message}`);

        const readLoop = async () => {
          try {
            for await (const chunk of containerStream) {
              ws.send(JSON.stringify({ type: "log", data: chunk.toString() }));
            }
          } catch (error) {
            console.error("Read loop error:", error);
            if (containerStream instanceof ReadableStream) containerStream.end();
            containerStreams.delete(ws);
            clearInterval(statsPoll);
            ws.send(
              JSON.stringify({ type: "error", message: "Error reading stream" })
            );
          }
        };

        readLoop();

        ws.onclose = () => {
          console.log("Client disconnected");
          const stream = containerStreams.get(ws);
          if (stream) {
            stream.destroy();
            containerStreams.delete(ws);
          }
          clearInterval(statsPoll);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          const stream = containerStreams.get(ws);
          if (stream) {
            stream.destroy();
            containerStreams.delete(ws);
          }
          clearInterval(statsPoll);
        };
      } else if (data.type === "command") {
        const containerStream = containerStreams.get(ws);
        if (containerStream) {
          containerStream.write(data.message + "\n");
        } else {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Not connected to container",
            })
          );
        }
      }
    } catch (error) {
      console.error("Error handling message:", error);
      ws.send(
        JSON.stringify({ type: "error", message: "Error in message handling" })
      );
    }
  });
});

export { dockerWss };