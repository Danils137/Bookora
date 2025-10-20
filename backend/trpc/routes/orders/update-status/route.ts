import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { orders } from '@/lib/mock-db';
import { TRPCError } from '@trpc/server';

export const updateOrderStatusProcedure = publicProcedure
  .input(
    z.object({
      orderId: z.string(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    })
  )
  .mutation(async ({ input }) => {
    const order = orders.find((o) => o.id === input.orderId);

    if (!order) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Order not found',
      });
    }

    order.status = input.status;
    order.updatedAt = new Date();

    return { order };
  });
