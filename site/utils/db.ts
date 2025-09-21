"use server";

import { db } from "@/utils/prisma";

export async function getSubscriptionFeed(userId: string, limit: number = 20) {
  return await db.video.findMany({
    where: {
      uploader: {
        subscribers: {
          some: {
            subscriberId: userId,
          },
        },
      },
    },
    include: {
      uploader: true,
      _count: {
        select: {
          likesList: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getVideoStats(videoId: string) {
  const video = await db.video.findUnique({
    where: { id: videoId },
    include: {
      _count: {
        select: {
          likesList: true,
        },
      },
    },
  });

  if (!video) return null;

  return {
    views: video.views,
    likes: video.likes,
    likesFromList: video._count.likesList,
  };
}

export async function getUserStats(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          videos: true,
          subscriptions: true,
          subscribers: true,
          likes: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    videosCount: user._count.videos,
    subscriptionsCount: user._count.subscriptions,
    subscribersCount: user.subscribersCount,
    likesGivenCount: user._count.likes,
  };
}