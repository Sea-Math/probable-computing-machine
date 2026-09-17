import { buildApp } from "./index";

const port = Number(process.env.MUSIC_PORT) || 2010;

const app = await buildApp();
await app.listen({ port, host: "0.0.0.0" });
console.log(`x8music spinning safely on http://localhost:${port}`);
