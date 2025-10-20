import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { users } from '@/lib/mock-db';
import { TRPCError } from '@trpc/server';

export const loginProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  )
  .mutation(async ({ input }) => {
    const user = users.find(
      (u) => u.email === input.email && u.password === input.password
    );

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    if (user.status === 'suspended') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Account suspended',
      });
    }

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: 'mock-jwt-token',
    };
  });
