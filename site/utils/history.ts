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
  const existingEntry = await db.history.findFirst({
    where: {
      userId:
        typeof history.user === "object" && "connect" in history.user
          ? history.user.connect?.id
          : undefined,
      videoId:
        typeof history.video === "object" && "connect" in history.video
          ? history.video.connect?.id
          : undefined,
    },
  });

  if (existingEntry) {
    return await db.history.update({
      where: { id: existingEntry.id },
      data: { watchedAt: new Date() },
      include: {
        user: true,
        video: {
          include: {
            uploader: true,
          },
        },
      },
    });
  } else {
    return await db.history.create({
      data: history,
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
}

export async function deleteHistoryEntry(id: string) {
  return await db.history.delete({ where: { id } });
}

export async function clearUserHistory(userId: string) {
  return await db.history.deleteMany({ where: { userId } });
}