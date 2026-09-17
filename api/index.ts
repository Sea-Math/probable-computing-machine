import type { IncomingMessage, ServerResponse } from "node:http";
import { buildApp } from "../index";

let appPromise: ReturnType<typeof buildApp> | undefined;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    appPromise ??= buildApp();
    const app = await appPromise;

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const finish = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      const fail = (error: unknown) => {
        if (!settled) {
          settled = true;
          reject(error);
        }
      };

      res.once("finish", finish);
      res.once("close", finish);
      res.once("error", fail);

      app.server.emit("request", req, res);
    });
  } catch (error) {
    console.error("Vercel API invocation failed:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          error: "API invocation failed",
          message: error instanceof Error ? error.message : String(error),
        }),
      );
    } else if (!res.writableEnded) {
      res.end();
    }
  }
}
