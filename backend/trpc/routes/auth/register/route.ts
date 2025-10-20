import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { users } from '@/lib/mock-db';
import { TRPCError } from '@trpc/server';
import { UserRole } from '@/types/database';

export const registerProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
      role: z.enum(['buyer', 'seller']),
      companyName: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const existingUser = users.find((u) => u.email === input.email);

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email already registered',
      });
    }

    if (input.role === 'seller' && !input.companyName) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company name required for sellers',
      });
    }

    const newUser = {
      id: Date.now().toString(),
      email: input.email,
      password: input.password,
      name: input.name,
      role: input.role as UserRole,
      status: input.role === 'seller' ? ('pending' as const) : ('active' as const),
      companyName: input.companyName,
      companyVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token: 'mock-jwt-token',
    };
  });
