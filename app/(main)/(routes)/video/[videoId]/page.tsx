"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import VideoPlayer from "../_components/VideoPlayer";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Editor from "../_components/Editor";
import { ChatBot } from "../_components/Chatbot";

const VideoPage = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("id") as string;
  const pathname = usePathname();
  const videoDocId = pathname.split("/").pop() as Id<"videos">;

  const video = useQuery(api.video.getVideoById, { id: videoDocId });
  const savedTime = video?.watchProgress ?? 0;

  const saveContent = useMutation(api.video.saveContent);

  const onChange = (content: string) => {
    saveContent({ id: videoDocId, content });
  };

  return (
    <div className="flex h-screen overflow-y-hidden pt-14 relative">
      <main className="flex-1 overflow-hidden p-2">
        <div className="flex flex-col md:flex-row h-full gap-4">
          {/* Video Section */}
          <div className="w-full md:w-[60%] sticky top-0 h-fit self-start">
            <VideoPlayer
              videoId={videoId}
              savedTime={savedTime}
              videoDocId={videoDocId}
            />
          </div>

          {/* Notes Section */}
          <div className="flex-1 overflow-y-auto border dark:bg-[rgb(31,31,31)] rounded-xl shadow-sm p-5 bg-white">
            <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
            {video === undefined ? (
              <p className="text-muted-foreground">Loading notes...</p>
            ) : (
              <Editor initialContent={video.content} onChange={onChange} />
            )}
          </div>
        </div>
      </main>
      <ChatBot />
    </div>
  );
};

export default VideoPage;
