import { createServer } from "vite";

const server = await createServer({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
  },
});

await server.listen();
server.printUrls();
