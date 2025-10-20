import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { BookService } from '@/lib/services/bookService';
import { TRPCError } from '@trpc/server';

export const createBookProcedure = publicProcedure
  .input(
    z.object({
      sellerId: z.string(),
      title: z.string().min(1),
      author: z.string().min(1),
      isbn: z.string().min(10),
      description: z.string(),
      genre: z.string(),
      publisher: z.string(),
      price: z.number().positive(),
      stock: z.number().int().nonnegative(),
      imageUrl: z.string().url(),
      publicationYear: z.number().int(),
      language: z.string(),
      pages: z.number().int().positive(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const newBook = await BookService.create(input);

      return { book: newBook };
    } catch (error) {
      console.error('Error creating book:', error);

      if (error instanceof Error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create book',
      });
    }
  });
