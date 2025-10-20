import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { cors } from 'hono/cors';

// Простые процедуры для тестирования
const app = new Hono();

app.use('*', cors());

// Простой тест эндпоинт
app.get('/api/trpc', (c) => {
  return c.json({ message: 'tRPC endpoint is working' });
});

// tRPC процедуры
const trpcApp = new Hono();

trpcApp.use('/trpc/*', (c) => {
  return c.json({ message: 'tRPC procedures not fully configured yet' });
});

app.route('/api', trpcApp);

app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'API is running' });
});

const port = 3002;

console.log(`🚀 Starting tRPC server on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`✅ tRPC server is running on http://localhost:${port}`);
console.log(`📡 tRPC endpoint available at http://localhost:${port}/api/trpc`);
