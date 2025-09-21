"use server";

import { db, type Prisma } from "@/utils/prisma";

export async function getUsers() {
  return await db.user.findMany({
    include: {
      videos: true,
      subscriptions: true,
      subscribers: true,
      _count: {
        select: {
          videos: true,
          subscriptions: true,
          subscribers: true,
        },
      },
    },
  });
}

export async function getUser(id: string) {
  return await db.user.findUnique({
    where: { id },
    include: {
      videos: true,
      subscriptions: {
        include: {
          creator: true,
        },
      },
      subscribers: {
        include: {
          subscriber: true,
        },
      },
      _count: {
        select: {
          videos: true,
          subscriptions: true,
          subscribers: true,
        },
      },
    },
  });
}

export async function getUserByEmail(email: string) {
  return await db.user.findUnique({ where: { email } });
}

export async function getUserByUsername(username: string) {
  return await db.user.findUnique({ where: { username } });
}

export async function createUser(user: Prisma.UserCreateInput) {
  return await db.user.create({ data: user });
}

export async function updateUser(id: string, user: Prisma.UserUpdateInput) {
  return await db.user.update({ where: { id }, data: user });
}

export async function incrementSubscribersCount(userId: string) {
  return await db.user.update({
    where: { id: userId },
    data: { subscribersCount: { increment: 1 } },
  });
}

export async function decrementSubscribersCount(userId: string) {
  return await db.user.update({
    where: { id: userId },
    data: { subscribersCount: { decrement: 1 } },
  });
}