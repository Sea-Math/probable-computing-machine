import type { IncomingMessage, ServerResponse } from "node:http";
import { buildApp } from "../index";

let readyPromise: Promise<ReturnType<typeof buildApp>> | undefined;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  readyPromise ??= buildApp();

  try {
    const app = await readyPromise;
    app.server.emit("request", req, res);
  } catch (error) {
    readyPromise = undefined;
    console.error("x8music initialization failed:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "Server initialization failed" }));
    } else {
      res.end();
    }
  }
}
