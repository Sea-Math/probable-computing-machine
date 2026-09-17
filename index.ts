import Fastify from "fastify";
import cors from "@fastify/cors";
import staticPlugin from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { musicRoutes } from "./routes/music";
import { youtubeRoutes } from "./routes/youtube";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const fastify = Fastify({ logger: { level: "info" } });

let initialized = false;

export async function buildApp() {
  if (initialized) return fastify;

  await fastify.register(cors, { origin: true });
  await fastify.register(staticPlugin, {
    root: path.join(__dirname, "public"),
    wildcard: false,
  });
  await fastify.register(musicRoutes);
  await fastify.register(youtubeRoutes);

  fastify.setNotFoundHandler((req, res) => {
    res.code(404).send({
      error: `${req.url} was not found on this server. Check the spelling and try again.`,
    });
  });

  initialized = true;
  await fastify.ready();
  return fastify;
}

if (!process.env.VERCEL) {
  const usePort = Number(process.env.MUSIC_PORT) || 2010;
  buildApp()
    .then(() => fastify.listen({ port: usePort, host: "0.0.0.0" }))
    .then(() => console.log("x8music running on http://localhost:" + usePort))
    .catch((err) => {
      fastify.log.error(err);
      process.exit(1);
    });
}
