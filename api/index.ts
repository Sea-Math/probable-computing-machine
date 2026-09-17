import type { IncomingMessage, ServerResponse } from "node:http";
import { buildApp } from "../index";

let appPromise: ReturnType<typeof buildApp> | undefined;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    appPromise ??= buildApp();
    const app = await appPromise;
    await app.ready();
    app.server.emit("request", req, res);
  } catch (error) {
    console.error("Vercel API initialization failed:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ error: "API initialization failed" }));
    } else {
      res.end();
    }
  }
}
