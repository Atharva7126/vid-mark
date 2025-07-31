import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  videos: defineTable({
    userId: v.string(),
    videoId: v.string(),
    title: v.string(),
    thumbnail: v.string(),
    duration: v.string(),
    watchProgress: v.optional(v.number()),
    channelId: v.optional(v.string()),
    channelPicture: v.optional(v.string()),
    stared: v.optional(v.boolean()),
    isCompleted: v.optional(v.boolean()),
    isWatching: v.optional(v.boolean()),
    content: v.optional(v.string()),
    channelTitle: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_videoId_userId", ["videoId", "userId"]),

  chats: defineTable({
    userId: v.string(),           // Who sent the message
    videoId: v.id("videos"),      // Which video this chat is about
    message: v.string(),          // The actual message content
    role: v.union(               // Whether it's from user or AI
      v.literal("user"),
      v.literal("assistant")
    ),
    timestamp: v.number(),        // When the message was sent
  })
    .index("by_videoId", ["videoId"])  // To get all chats for a specific video
    .index("by_userId", ["userId"])    // To get all chats by a user
    .index("by_videoId_timestamp", ["videoId", "timestamp"]), // To get chats in order
});
