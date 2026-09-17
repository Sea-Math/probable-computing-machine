import Fastify from "fastify";
import cors from "@fastify/cors";
import staticPlugin from "@fastify/static";
import path from "node:path";
import { musicRoutes } from "./routes/music";
import { youtubeRoutes } from "./routes/youtube";

export const fastify = Fastify({ logger: true });

let registered = false;
let registrationPromise: Promise<void> | undefined;

export async function buildApp(): Promise<typeof fastify> {
  if (registered) return fastify;
  if (registrationPromise) {
    await registrationPromise;
    return fastify;
  }

  registrationPromise = (async () => {
    await fastify.register(cors, { origin: true });
    await fastify.register(staticPlugin, {
      root: path.join(process.cwd(), "public"),
      wildcard: false,
      decorateReply: false,
    });
    await fastify.register(musicRoutes);
    await fastify.register(youtubeRoutes);

    fastify.setNotFoundHandler((request, reply) => {
      reply.code(404).send({
        error: `${request.url} was not found on this server. Check the spelling and try again.`,
      });
    });

    await fastify.ready();
    registered = true;
  })();

  try {
    await registrationPromise;
  } catch (error) {
    registrationPromise = undefined;
    throw error;
  }

  return fastify;
}
