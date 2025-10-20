import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { orders } from '@/lib/mock-db';

export const listOrdersProcedure = publicProcedure
  .input(
    z.object({
      buyerId: z.string().optional(),
      sellerId: z.string().optional(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
    })
  )
  .query(async ({ input }) => {
    let filteredOrders = [...orders];

    if (input.buyerId) {
      filteredOrders = filteredOrders.filter((order) => order.buyerId === input.buyerId);
    }

    if (input.sellerId) {
      filteredOrders = filteredOrders.filter((order) =>
        order.items.some((item) => item.sellerId === input.sellerId)
      );
    }

    if (input.status) {
      filteredOrders = filteredOrders.filter((order) => order.status === input.status);
    }

    return { orders: filteredOrders };
  });

  