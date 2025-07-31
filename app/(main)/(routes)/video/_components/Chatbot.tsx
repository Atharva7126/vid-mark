// components/ChatBot.tsx
"use client";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { ChatInterface } from "./chat-interface";
import { useParams, useSearchParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export function ChatBot() {
    const [isOpen, setIsOpen] = React.useState(false);
    const params = useParams()
    const searchParams = useSearchParams();
    const YtvideoId = searchParams.get("id") as string || params.videoId as string
    const videoId = params.videoId as Id<"videos"> || "";

    // Don't show chat if no video ID
    if (!videoId) {
        return null;
    }

    return (
        <div className="fixed bottom-0 right-0 m-4">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="default"
                        size="icon"
                        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
                    >
                        <Bot className="h-10 w-10" />
                        <span className="sr-only">Open chat</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    side="top"
                    align="end"
                    className="w-[380px] h-[500px] md:w-[420px] md:h-[530px] p-0 border-0 shadow-2xl rounded-2xl overflow-hidden"
                    sideOffset={16}
                >
                    {/* Pass the video ID to ChatInterface */}
                    <ChatInterface youtubeVideoId={YtvideoId} videoId={videoId} />
                </PopoverContent>
            </Popover>
        </div>
    );
}