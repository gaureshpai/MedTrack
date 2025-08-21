"use server";
import { Prisma, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// ==================== USER FUNCTIONS ====================
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

export async function deleteUser(id: string) {
  return await db.user.delete({ where: { id } });
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

// ==================== VIDEO FUNCTIONS ====================
export async function getVideos() {
  return await db.video.findMany({
    include: {
      uploader: true,
      _count: {
        select: {
          likesList: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVideo(id: string) {
  return await db.video.findUnique({
    where: { id },
    include: {
      uploader: true,
      likesList: true,
      _count: {
        select: {
          likesList: true,
        },
      },
    },
  });
}

export async function getVideosByUser(uploaderId: string) {
  return await db.video.findMany({
    where: { uploaderId },
    include: {
      uploader: true,
      _count: {
        select: {
          likesList: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVideosByCategory(category: string) {
  return await db.video.findMany({
    where: { category },
    include: {
      uploader: true,
      _count: {
        select: {
          likesList: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function searchVideos(query: string) {
  return await db.video.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query] } },
      ],
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
  });
}

export async function createVideo(video: Prisma.VideoCreateInput) {
  return await db.video.create({
    data: video,
    include: {
      uploader: true,
    },
  });
}

export async function updateVideo(id: string, video: Prisma.VideoUpdateInput) {
  return await db.video.update({
    where: { id },
    data: video,
    include: {
      uploader: true,
    },
  });
}

export async function deleteVideo(id: string) {
  return await db.video.delete({ where: { id } });
}

export async function incrementVideoViews(id: string) {
  return await db.video.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

export async function incrementVideoLikes(id: string) {
  return await db.video.update({
    where: { id },
    data: { likes: { increment: 1 } },
  });
}

export async function decrementVideoLikes(id: string) {
  return await db.video.update({
    where: { id },
    data: { likes: { decrement: 1 } },
  });
}

export async function getTrendingVideos(limit: number = 10) {
  return await db.video.findMany({
    include: {
      uploader: true,
      _count: {
        select: {
          likesList: true,
        },
      },
    },
    orderBy: [{ views: "desc" }, { likes: "desc" }],
    take: limit,
  });
}

// ==================== SUBSCRIPTION FUNCTIONS ====================
export async function getSubscriptions() {
  return await db.subscription.findMany({
    include: {
      subscriber: true,
      creator: true,
    },
  });
}

export async function getSubscription(id: string) {
  return await db.subscription.findUnique({
    where: { id },
    include: {
      subscriber: true,
      creator: true,
    },
  });
}

export async function getUserSubscriptions(subscriberId: string) {
  return await db.subscription.findMany({
    where: { subscriberId },
    include: {
      creator: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserSubscribers(creatorId: string) {
  return await db.subscription.findMany({
    where: { creatorId },
    include: {
      subscriber: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function checkSubscription(
  subscriberId: string,
  creatorId: string
) {
  return await db.subscription.findFirst({
    where: {
      subscriberId,
      creatorId,
    },
  });
}

export async function createSubscription(
  subscription: Prisma.SubscriptionCreateInput
) {
  // Create subscription and increment creator's subscriber count
  const result = await db.$transaction(async (tx) => {
    const newSubscription = await tx.subscription.create({
      data: subscription,
      include: {
        subscriber: true,
        creator: true,
      },
    });

    await tx.user.update({
      where: { id: newSubscription.creatorId },
      data: { subscribersCount: { increment: 1 } },
    });

    return newSubscription;
  });

  return result;
}

export async function deleteSubscription(id: string) {
  // Delete subscription and decrement creator's subscriber count
  return await db.$transaction(async (tx) => {
    const subscription = await tx.subscription.findUnique({ where: { id } });
    if (!subscription) throw new Error("Subscription not found");

    await tx.subscription.delete({ where: { id } });

    await tx.user.update({
      where: { id: subscription.creatorId },
      data: { subscribersCount: { decrement: 1 } },
    });

    return subscription;
  });
}

export async function unsubscribe(subscriberId: string, creatorId: string) {
  return await db.$transaction(async (tx) => {
    const subscription = await tx.subscription.findFirst({
      where: {
        subscriberId,
        creatorId,
      },
    });

    if (!subscription) throw new Error("Subscription not found");

    await tx.subscription.delete({ where: { id: subscription.id } });

    await tx.user.update({
      where: { id: creatorId },
      data: { subscribersCount: { decrement: 1 } },
    });

    return subscription;
  });
}

// ==================== LIKE FUNCTIONS ====================
export async function getLikes() {
  return await db.like.findMany({
    include: {
      user: true,
      video: true,
    },
  });
}

export async function getLike(id: string) {
  return await db.like.findUnique({
    where: { id },
    include: {
      user: true,
      video: true,
    },
  });
}

export async function getUserLikes(userId: string) {
  return await db.like.findMany({
    where: { userId },
    include: {
      video: {
        include: {
          uploader: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVideoLikes(videoId: string) {
  return await db.like.findMany({
    where: { videoId },
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function checkLike(userId: string, videoId: string) {
  return await db.like.findFirst({
    where: {
      userId,
      videoId,
    },
  });
}

export async function createLike(like: Prisma.LikeCreateInput) {
  // Create like and increment video likes count
  return await db.$transaction(async (tx) => {
    const newLike = await tx.like.create({
      data: like,
      include: {
        user: true,
        video: true,
      },
    });

    if (newLike.videoId) {
      await tx.video.update({
        where: { id: newLike.videoId },
        data: { likes: { increment: 1 } },
      });
    }

    return newLike;
  });
}

export async function deleteLike(id: string) {
  // Delete like and decrement video likes count
  return await db.$transaction(async (tx) => {
    const like = await tx.like.findUnique({ where: { id } });
    if (!like) throw new Error("Like not found");

    await tx.like.delete({ where: { id } });

    if (like.videoId) {
      await tx.video.update({
        where: { id: like.videoId },
        data: { likes: { decrement: 1 } },
      });
    }

    return like;
  });
}

export async function toggleLike(userId: string, videoId: string) {
  const existingLike = await checkLike(userId, videoId);

  if (existingLike) {
    await deleteLike(existingLike.id);
    return { liked: false, like: null };
  } else {
    const newLike = await createLike({
      user: { connect: { id: userId } },
      video: { connect: { id: videoId } },
    });
    return { liked: true, like: newLike };
  }
}

// ==================== HISTORY FUNCTIONS ====================
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
  // Check if entry already exists for this user and video
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
    // Update the watchedAt time
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
    // Create new history entry
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

// ==================== NOTIFICATION FUNCTIONS ====================
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

export async function updateNotification(
  id: string,
  notification: Prisma.NotificationUpdateInput
) {
  return await db.notification.update({
    where: { id },
    data: notification,
    include: {
      user: true,
    },
  });
}

export async function markNotificationAsRead(id: string) {
  return await db.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  return await db.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function deleteNotification(id: string) {
  return await db.notification.delete({ where: { id } });
}

export async function deleteAllUserNotifications(userId: string) {
  return await db.notification.deleteMany({ where: { userId } });
}

// ==================== UTILITY/AGGREGATE FUNCTIONS ====================
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

export default db;
