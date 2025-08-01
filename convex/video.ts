import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { parseISO8601 } from "@/lib/youtube";

export const addVideo = mutation({
    args: {
        videoId: v.string(),
        title: v.string(),
        thumbnail: v.string(),
        duration: v.string(),
        watchProgress: v.optional(v.number()),
        channelTitle: v.string(),
        channelId: v.string(),
        channelPicture: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        const existingVideo = await ctx.db
            .query("videos")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("videoId"), args.videoId))
            .first();
            
        if (existingVideo) {
            throw new Error("Video already exists");
        }

        await ctx.db.insert("videos", {
            userId,
            videoId: args.videoId,
            title: args.title,
            thumbnail: args.thumbnail,
            duration: args.duration,
            channelId: args.channelId,
            watchProgress: args.watchProgress,
            channelTitle: args.channelTitle,
            channelPicture: args.channelPicture,
            isWatching: true,
            isCompleted: false,
        });
    },
});

export const listByUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        return await ctx.db
            .query("videos")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();
    },
});

export const GetCompletedVideos = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        const video = await ctx.db
            .query("videos")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.eq(q.field("isCompleted"), true)
            )
            .collect();

        return video;
    }
})

export const GetisWatchingVideos = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        const video = await ctx.db
            .query("videos")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.eq(q.field("isWatching"), true)
            )
            .collect();

        return video;
    }
})

export const GetStaredVideos = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        const video = await ctx.db
            .query("videos")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.eq(q.field("stared"), true)
            )
            .collect();

        return video;
    }
})

export const toggleStar = mutation({
    args: { videoId: v.id("videos") },
    handler: async (ctx, { videoId }) => {
        const video = await ctx.db.get(videoId)
        if (!video) throw new Error("Video not found")
        await ctx.db.patch(videoId, { stared: !video.stared })
    }
})

export const getVideoById = query({
    args: { id: v.id("videos") },
    handler: async (ctx, { id }) => {
        const identity = await ctx.auth.getUserIdentity()

        const video = await ctx.db.get(id)

        if (!video) throw new Error("Video not found")

        if (!identity) {
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        if (video.userId !== userId) {
            throw new Error("You do not have permission to access this video")
        }

        return video
    }
})

export const updateProgress = mutation({
    args: {
        id: v.id("videos"),
        time: v.float64(),
    },
    handler: async (ctx, { id, time }) => {
        const video = await ctx.db.get(id)
        if (!video) throw new Error("Video not found")

        await ctx.db.patch(id, { watchProgress: time })

        const totalSeconds = parseISO8601(video.duration);

        if (time >= totalSeconds - 10) {
            await ctx.db.patch(id, { isCompleted: true, isWatching: false });
        }
    }
})

export const deleteVideo = mutation({
    args: { id: v.id("videos") },
    handler: async (ctx, { id }) => {
        const video = await ctx.db.get(id)
        if (!video) throw new Error("Video not found")

        await ctx.db.delete(id)
    }
})

export const saveContent = mutation({
    args: {
        id: v.id("videos"),
        content: v.string(),
    },
    handler: async (ctx, { id, content }) => {
        const video = await ctx.db.get(id)
        if (!video) throw new Error("Video not found")

        await ctx.db.patch(id, { content })
    }
})

export const markAsCompleted = mutation({
    args: { id: v.id("videos") },
    handler: async (ctx, { id }) => {
        const video = await ctx.db.get(id)
        if (!video) throw new Error("Video not found")

        await ctx.db.patch(id, { isCompleted: true, isWatching: false })
    }
})

export const getWatchStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const videos = await ctx.db
      .query("videos")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    const totalSeconds = videos.reduce((sum, video) => {
      return sum + (video.watchProgress ?? 0);
    }, 0);

    return totalSeconds;
  },
});
