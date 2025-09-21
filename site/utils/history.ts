"use server";

import { db, type Prisma } from "@/utils/prisma";

export async function getHistory() {
  return await db.history.findMany({
    include: {
      user: true,
      video: {
        include: {
          uploader: true,
        },
      },
    },
  });
}

export async function getHistoryItem(id: string) {
  return await db.history.findUnique({
    where: { id },
    include: {
      user: true,
      video: {
        include: {
          uploader: true,
        },
      },
    },
  });
}

export async function getUserHistory(userId: string, limit?: number) {
  return await db.history.findMany({
    where: { userId },
    include: {
      video: {
        include: {
          uploader: true,
        },
      },
    },
    orderBy: { watchedAt: "desc" },
    take: limit,
  });
}

export async function createHistoryEntry(history: Prisma.HistoryCreateInput) {
  const userId = typeof history.user === "object" && "connect" in history.user
    ? history.user.connect?.id
    : undefined;
  const videoId = typeof history.video === "object" && "connect" in history.video
    ? history.video.connect?.id
    : undefined;

  if (!userId || !videoId) {
    throw new Error("userId and videoId are required for history operations");
  }

  return await db.history.upsert({
    where: {
      userId_videoId: { userId, videoId }
    },
    update: { watchedAt: new Date() },
    create: history,
    include: {
      user: true,
      video: {
        include: {
          uploader: true,
        },
      },
    },
  });
}

export async function deleteHistoryEntry(id: string) {
  return await db.history.delete({ where: { id } });
}

export async function clearUserHistory(userId: string) {
  return await db.history.deleteMany({ where: { userId } });
}