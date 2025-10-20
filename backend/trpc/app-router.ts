import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { loginProcedure } from "./routes/auth/login/route";
import { registerProcedure } from "./routes/auth/register/route";
import { listBooksProcedure } from "./routes/books/list/route";
import { getBookProcedure } from "./routes/books/get/route";
import { createBookProcedure } from "./routes/books/create/route";
import { updateBookProcedure } from "./routes/books/update/route";
import { deleteBookProcedure } from "./routes/books/delete/route";
import { createOrderProcedure } from "./routes/orders/create/route";
import { listOrdersProcedure } from "./routes/orders/list/route";
import { updateOrderStatusProcedure } from "./routes/orders/update-status/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    login: loginProcedure,
    register: registerProcedure,
  }),
  books: createTRPCRouter({
    list: listBooksProcedure,
    get: getBookProcedure,
    create: createBookProcedure,
    update: updateBookProcedure,
    delete: deleteBookProcedure,
  }),
  orders: createTRPCRouter({
    create: createOrderProcedure,
    list: listOrdersProcedure,
    updateStatus: updateOrderStatusProcedure,
  }),
});

export type AppRouter = typeof appRouter;
