import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';
import { clerkClient } from '@clerk/nextjs/server';

const phonePattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(200, {
      message: 'Name must not be longer than 200 characters.',
    }),
  lastName: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(200, {
      message: 'Name must not be longer than 200 characters.',
    }),
  email: z.string().email().optional(),
  phone: z.string().regex(phonePattern, 'Invalid phone number').optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
});

export const usersRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(profileFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName } = input;

      await clerkClient().users.updateUser(ctx.auth.userId, {
        firstName,
        lastName,
      });
    }),
  checkIfUserHasPassword: protectedProcedure.query(async ({ ctx }) => {
    const user = await clerkClient().users.getUser(ctx.auth.userId);
    return user.passwordEnabled;
  }),
  resetPassword: protectedProcedure
    .input(
      z.object({
        newPassword: z.string(),
        oldPassword: z.string(),
        oldPassword2: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { newPassword, oldPassword, oldPassword2 } = input;
      if (oldPassword !== oldPassword2) {
        throw new Error('Old passwords do not match');
      }

      const hasPassword = await clerkClient()
        .users.getUser(ctx.auth.userId)
        .then((user) => user.passwordEnabled);

      if (!hasPassword) {
        throw new Error('Password is not enabled');
      }

      const { verified } = await clerkClient().users.verifyPassword({
        userId: ctx.auth.userId,
        password: oldPassword,
      });

      if (!verified) {
        throw new Error('Old password is incorrect');
      }

      await clerkClient().users.updateUser(ctx.auth.userId, {
        password: newPassword,
      });
    }),
  deleteUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      console.log('Deleting user', input.userId);
      // TODO: Implement delete based on appropriate permissions
      // await clerkClient().users.deleteUser(input.userId);
    }),
});
