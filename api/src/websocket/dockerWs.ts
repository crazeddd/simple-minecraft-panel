import { WebSocketServer } from "ws";
import Docker from "dockerode";

var docker = new Docker();

const dockerWss = new WebSocketServer({ port: 2401 });

dockerWss.on('connection', (ws) => {
    console.log("Connected to client");
    ws.on("message", (e: Buffer) => {
        try {
            const { id } = JSON.parse(e.toString());
            const container = docker.getContainer(id);
            console.log(id);
            container.attach({
                stream: true, stdout: true, stderr: true, stdin: true, logs: false
            }, function (error, stream) {
                if (error) {
                    console.error("Error when attaching:", error);
                }
                if (stream) {
                    console.log(`Established stream to ${id}`);
                    stream.on("data", (data) => {
                        ws.send(data.toString());
                    })
                    stream.on("end", () => {
                        console.log(`Closing stream to ${id}`);
                        ws.send("Closing RCON connection...");
                    })
                    ws.onclose = () => {
                        console.log(`Closing stream to ${id}`);
                        ws.send("Closing RCON connection...");
                        stream.end();
                    }
                } else {
                    console.error("No stream exists, cannot pipe data!")
                }
            })
        } catch (error) {
            console.error("Error: ", error);
        }
    })
});

export { dockerWss };

