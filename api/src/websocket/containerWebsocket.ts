import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 2401 });

export { wss };
