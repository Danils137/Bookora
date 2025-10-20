import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { books } from '@/lib/mock-db';
import { TRPCError } from '@trpc/server';

export const updateBookProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
      isbn: z.string().min(10).optional(),
      description: z.string().optional(),
      genre: z.string().optional(),
      publisher: z.string().optional(),
      price: z.number().positive().optional(),
      stock: z.number().int().nonnegative().optional(),
      imageUrl: z.string().url().optional(),
      publicationYear: z.number().int().optional(),
      language: z.string().optional(),
      pages: z.number().int().positive().optional(),
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

    const { id, ...updates } = input;

    books[bookIndex] = {
      ...books[bookIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return { book: books[bookIndex] };
  });
