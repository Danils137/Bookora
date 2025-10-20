import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { BookService } from '@/lib/services/bookService';

export const listBooksProcedure = publicProcedure
  .input(
    z.object({
      search: z.string().optional(),
      genre: z.string().optional(),
      author: z.string().optional(),
      publisher: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      sortBy: z.enum(['price', 'title', 'date']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    })
  )
  .query(async ({ input }) => {
    try {
      let books;

      // Если есть поисковый запрос, используем поиск
      if (input.search) {
        books = await BookService.search(input.search);
      } else if (input.genre) {
        books = await BookService.getByGenre(input.genre);
      } else {
        books = await BookService.getAll();
      }

      // Применяем дополнительные фильтры
      let filteredBooks = books;

      if (input.author) {
        filteredBooks = filteredBooks.filter((book) =>
          book.author.toLowerCase().includes(input.author!.toLowerCase())
        );
      }

      if (input.publisher) {
        filteredBooks = filteredBooks.filter((book) =>
          book.publisher.toLowerCase().includes(input.publisher!.toLowerCase())
        );
      }

      if (input.minPrice !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.price >= input.minPrice!);
      }

      if (input.maxPrice !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.price <= input.maxPrice!);
      }

      // Применяем сортировку
      if (input.sortBy) {
        filteredBooks.sort((a, b) => {
          let comparison = 0;

          switch (input.sortBy) {
            case 'price':
              comparison = a.price - b.price;
              break;
            case 'title':
              comparison = a.title.localeCompare(b.title);
              break;
            case 'date':
              comparison = a.createdAt.getTime() - b.createdAt.getTime();
              break;
          }

          return input.sortOrder === 'desc' ? -comparison : comparison;
        });
      }

      const total = filteredBooks.length;
      const paginatedBooks = filteredBooks.slice(input.offset, input.offset + input.limit);

      return {
        books: paginatedBooks,
        total,
        hasMore: input.offset + input.limit < total,
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('Failed to fetch books');
    }
  });
