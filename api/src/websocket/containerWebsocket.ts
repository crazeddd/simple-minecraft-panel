import { WebSocketServer } from "ws";

const logWss = new WebSocketServer({ port: 2401 });

export { logWss };
