import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";

// DB Connection
const client = await new Client().connect({
  hostname: Deno.env.get("DB_HOST") || "host",
  username: Deno.env.get("DB_USER") || "user",
  password: Deno.env.get("DB_PASS") || "password",
  db: Deno.env.get("DB_NAME") || "database",
  port: parseInt(Deno.env.get("DB_PORT") as string) || 3306,
});

// Router Setup
const router = new Router();

router.get("/ping-db", async (ctx) => {
  try {
    const result = await client.query("SELECT 1 AS status");
    ctx.response.body = { success: true, status: result };
  } catch (error: any) {
    ctx.response.status = 500;
    ctx.response.body = { success: false, error: error.message };
  }
});

// Create App
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

// Start Server
const PORT = 8000;
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
