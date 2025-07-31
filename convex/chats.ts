// convex/chats.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Function to save a new chat message
export const addMessage = mutation({
    args: {
        videoId: v.id("videos"),        // Which video this message is about
        message: v.string(),            // The message content
        role: v.union(                  // Who sent it - user or AI
            v.literal("user"), 
            v.literal("assistant")
        ),
    },
    handler: async (ctx, args) => {
        // Check if user is logged in
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        // Save the message to database
        await ctx.db.insert("chats", {
            userId,
            videoId: args.videoId,
            message: args.message,
            role: args.role,
            timestamp: Date.now(),  // Current time in milliseconds
        });
    },
});

// Function to get all chat messages for a specific video
export const getChatHistory = query({
    args: {
        videoId: v.id("videos"),
    },
    handler: async (ctx, args) => {
        // Check if user is logged in
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        // Get all messages for this video by this user, sorted by time
        const messages = await ctx.db
            .query("chats")
            .withIndex("by_videoId_timestamp", (q) => 
                q.eq("videoId", args.videoId)
            )
            .filter((q) => q.eq(q.field("userId"), userId))  // Only this user's chats
            .collect();

        return messages;
    },
});

// Function to clear all chat history for a video
export const clearChatHistory = mutation({
    args: {
        videoId: v.id("videos"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        // Find all messages for this video and user
        const messages = await ctx.db
            .query("chats")
            .withIndex("by_videoId", (q) => q.eq("videoId", args.videoId))
            .filter((q) => q.eq(q.field("userId"), userId))
            .collect();

        // Delete all messages
        for (const message of messages) {
            await ctx.db.delete(message._id);
        }
    },
});

export const deleteChats = mutation({
    args: {
        videoId: v.id("videos"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        // Find all messages for this video and user
        const messages = await ctx.db
            .query("chats")
            .withIndex("by_videoId", (q) => q.eq("videoId", args.videoId))
            .filter((q) => q.eq(q.field("userId"), userId))
            .collect();

        // Delete all messages
        for (const message of messages) {
            await ctx.db.delete(message._id);
        }
    },
})