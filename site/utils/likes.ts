"use server";

import { db, type Prisma } from "@/utils/prisma";

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