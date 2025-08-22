"use server";

import { db, type Prisma } from "@/utils/prisma";

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