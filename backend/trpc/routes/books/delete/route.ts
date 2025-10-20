import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { books } from '@/lib/mock-db';
import { TRPCError } from '@trpc/server';

export const deleteBookProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const bookIndex = books.findIndex((b) => b.id === input.id);

    if (bookIndex === -1) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Book not found',
      });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];

    return { book: deletedBook };
  });
