"use server";

import { db, type Prisma } from "@/utils/prisma";

export async function getNotifications() {
  return await db.notification.findMany({
    include: {
      user: true,
    },
  });
}

export async function getNotification(id: string) {
  return await db.notification.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
}

export async function getUserNotifications(
  userId: string,
  unreadOnly: boolean = false
) {
  return await db.notification.findMany({
    where: {
      userId,
      ...(unreadOnly && { isRead: false }),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUnreadNotificationsCount(userId: string) {
  return await db.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

export async function createNotification(
  notification: Prisma.NotificationCreateInput
) {
  return await db.notification.create({
    data: notification,
    include: {
      user: true,
    },
  });
}

export async function markNotificationAsRead(id: string, userId?: string) {
  const whereClause = userId ? { id, userId } : { id };
  
  return await db.notification.update({
    where: whereClause,
    data: { isRead: true },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  return await db.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}