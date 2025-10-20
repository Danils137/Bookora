import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { orders, books } from '@/lib/mock-db';
import { TRPCError } from '@trpc/server';
import { OrderItem } from '@/types/database';

export const createOrderProcedure = publicProcedure
  .input(
    z.object({
      buyerId: z.string(),
      items: z.array(
        z.object({
          bookId: z.string(),
          quantity: z.number().int().positive(),
        })
      ),
      shippingAddress: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        country: z.string(),
      }),
    })
  )
  .mutation(async ({ input }) => {
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const item of input.items) {
      const book = books.find((b) => b.id === item.bookId);

      if (!book) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Book ${item.bookId} not found`,
        });
      }

      if (book.stock < item.quantity) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Insufficient stock for ${book.title}`,
        });
      }

      orderItems.push({
        bookId: book.id,
        sellerId: book.sellerId,
        quantity: item.quantity,
        price: book.price,
        book,
      });

      totalAmount += book.price * item.quantity;

      book.stock -= item.quantity;
      book.updatedAt = new Date();
    }

    const newOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      buyerId: input.buyerId,
      items: orderItems,
      totalAmount,
      status: 'pending' as const,
      shippingAddress: input.shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    orders.push(newOrder);

    return { order: newOrder };
  });
