import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // Для веб-приложения используем тот же домен с портом сервера
  if (typeof window !== 'undefined') {
    // В браузере
    const port = window.location.port;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;

    // Если порт не стандартный (80 или 443), добавляем его
    const portSuffix = port && port !== '80' && port !== '443' ? `:${port}` : '';

    return `${protocol}//${hostname}${portSuffix}`;
  }

  // Для сервера разработки (fallback)
  return 'http://localhost:3002';
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});
