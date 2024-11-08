import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 2400 });

export default wss;
