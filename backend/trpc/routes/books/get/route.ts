import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { BookService } from '@/lib/services/bookService';
import { TRPCError } from '@trpc/server';

export const getBookProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      const book = await BookService.getById(input.id);

      if (!book) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Book not found',
        });
      }

      return { book };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      console.error('Error fetching book:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch book',
      });
    }
  });
