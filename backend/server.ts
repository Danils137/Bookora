import { serve } from '@hono/node-server';
import app from './hono';

const port = 3001;

console.log(`🚀 Starting tRPC server on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`✅ tRPC server is running on http://localhost:${port}`);
console.log(`📡 tRPC endpoint available at http://localhost:${port}/api/trpc`);
