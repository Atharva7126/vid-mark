// components/chat-interface.tsx
"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Send, Loader2, Trash2, AlertCircle, Copy, CopyCheck } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useVideoChat } from "@/hooks/useVideoChat";
import { SyncLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useChatStore } from "@/hooks/chats";
import { toast } from "sonner";

// Define what a chat message looks like
interface ChatMessage {
  _id: Id<"chats">;
  role: "user" | "assistant";
  message: string;
  timestamp: number;
}

interface ChatInterfaceProps {
  videoId: Id<"videos">;
  youtubeVideoId: string;
}

export function ChatInterface({ videoId, youtubeVideoId }: ChatInterfaceProps) {
  // State for the current message being typed
  const [currentMessage, setCurrentMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Reference to scroll to bottom of chat
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Zustand store for chat history and transcripts
  const {
    ChatHistory,
    transcripts,
    setChatHistory,
    setTranscript,
  } = useChatStore();

  // Check if we already have cached data
  const cachedChatHistory = ChatHistory[videoId];
  const cachedTranscript = transcripts[youtubeVideoId];

  // Use the video chat hook (handles transcript fetching)
  const {
    transcript,
    isLoadingTranscript,
    transcriptError,
    sendMessage,
    isLoadingResponse
  } = useVideoChat({
    youtubeVideoId,
    // Pass cached transcript to avoid refetching
    cachedTranscript
  });

  // Convex functions to interact with database (for chat history only)
  const addMessage = useMutation(api.chats.addMessage);
  const clearHistory = useMutation(api.chats.clearChatHistory);

  // Get chat history from database only if not cached
  const chatHistoryQuery = useQuery(
    api.chats.getChatHistory,
    cachedChatHistory ? "skip" : { videoId }
  );

  // Determine the current chat history to use
  const currentChatHistory = cachedChatHistory || chatHistoryQuery;

  // Cache chat history when it's loaded from database
  useEffect(() => {
    if (chatHistoryQuery && !cachedChatHistory) {
      setChatHistory(videoId, chatHistoryQuery);
    }
  }, [chatHistoryQuery, cachedChatHistory, videoId, setChatHistory]);

  // Cache transcript when it's loaded
  useEffect(() => {
    if (transcript && !cachedTranscript && JSON.stringify(transcript) !== JSON.stringify(cachedTranscript)) {
      setTranscript(youtubeVideoId, transcript);
    }
  }, [transcript, cachedTranscript, youtubeVideoId, setTranscript]);


  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [currentChatHistory]);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    // Don't send empty messages or if already loading
    if (!currentMessage.trim() || isLoadingResponse || isLoadingTranscript) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage(""); // Clear input immediately

    try {
      // 1. Save user message to database first
      const newUserMessageId = await addMessage({
        videoId,
        message: userMessage,
        role: "user",
      });

      // 2. Create user message object with real ID
      const newUserMessage = {
        _id: newUserMessageId,
        role: "user" as const,
        message: userMessage,
        timestamp: Date.now(),
      };

      // 3. Update cache with user message
      const updatedHistory = [...(currentChatHistory || []), newUserMessage];
      setChatHistory(videoId, updatedHistory);

      // 4. Prepare chat history for AI context
      const formattedHistory = updatedHistory.map(msg => ({
        role: msg.role,
        message: msg.message,
      }));

      // 5. Get AI response (this will use cached transcript if available)
      const aiResponseText = await sendMessage(userMessage, formattedHistory);

      // 6. Save AI response to database
      const newAiMessageId = await addMessage({
        videoId,
        message: aiResponseText,
        role: "assistant",
      });

      // 7. Create AI message object with real ID
      const newAiMessage = {
        _id: newAiMessageId,
        role: "assistant" as const,
        message: aiResponseText,
        timestamp: Date.now(),
      };

      // 8. Update cache with final history including AI response
      const finalHistory = [...updatedHistory, newAiMessage];
      setChatHistory(videoId, finalHistory);

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again", {
        duration: 3000,
        position: "top-right",
      });

      // Refresh chat history from database on error
      if (chatHistoryQuery) {
        setChatHistory(videoId, chatHistoryQuery);
      }
    }
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to clear all chat history
  const handleClearHistory = async () => {
    toast.promise(
      (async () => {
        await clearHistory({ videoId });
        setChatHistory(videoId, []); // clear cache
      })(),
      {
        loading: "Clearing history...",
        success: "History cleared successfully!",
        error: "Failed to clear history",
        duration: 3000,
        position: "top-right",
      }
    );
  };

  const handleCopy = async (message: any) => {
    await navigator.clipboard.writeText(message)
    setCopied(true);
    setTimeout(() => setCopied(false), 1500)
  }

  // Determine if we can send messages
  const canSendMessage = !isLoadingResponse && !isLoadingTranscript && !transcriptError;

  // Determine loading states
  const isLoadingChatHistory = !cachedChatHistory && chatHistoryQuery === undefined;
  const currentTranscript = cachedTranscript || transcript;
  const isCurrentlyLoadingTranscript = !cachedTranscript && isLoadingTranscript;

  return (
    <div className="flex flex-col h-full border bg-white dark:bg-[#1F1F1F]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-[#2B2B2B] dark:border-zinc-700">
        <div>
          <h3 className="font-semibold text-lg text-black dark:text-white">Video Chat</h3>
          <div className="flex items-center space-x-2">
            {isCurrentlyLoadingTranscript ? (
              <div className="flex items-center space-x-1">
                <Loader2 className="h-3 w-3 animate-spin text-gray-600 dark:text-gray-300" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Loading transcript...</span>
              </div>
            ) : transcriptError ? (
              <div className="flex items-center space-x-1">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span className="text-xs text-red-600">Transcript error</span>
              </div>
            ) : currentTranscript ? (
              <span className="text-xs text-green-600">✓ Ready to chat</span>
            ) : (
              <span className="text-xs text-gray-600 dark:text-gray-400">Ready</span>
            )}
          </div>
        </div>
        <ConfirmModal onConfirm={handleClearHistory}>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </ConfirmModal>
      </div>

      {/* Chat Messages */}
      <div ref={scrollAreaRef} className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full w-full">
          <div className="space-y-4">
            {currentChatHistory?.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-300 py-8">
                <p>👋 Hi! I'm here to help you understand this video.</p>
                <p className="text-sm mt-2">Ask me anything about the content!</p>
                {isCurrentlyLoadingTranscript && (
                  <p className="text-xs mt-2 text-blue-600">Fetching transcript…</p>
                )}
              </div>
            )}
            {isLoadingChatHistory ? (
              <div className="text-center text-gray-500 dark:text-gray-300 py-8">
                <p className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-300" />
                  <span>Loading chat history...</span>
                </p>
                {transcriptError && (
                  <div>
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                    <p>Failed to load video transcript</p>
                    <p className="text-sm mt-2 text-red-600">{transcriptError}</p>
                    <p className="text-sm mt-2">Please try sending a message to retry.</p>
                  </div>
                )}
              </div>
            ) : (
              currentChatHistory?.map((message) => (
                <div
                  key={message._id ?? `${message.role}-${message.timestamp}`}
                  className={`flex p-2 ${message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={` max-w-[80%] p-3 rounded-2xl shadow-sm ${message.role === "user"
                      ? "bg-blue-600 text-white dark:bg-blue-500" // user bubble
                      : "bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white" // bot bubble
                      }`}
                  >


                    {/* Enhanced markdown styling for better chat appearance */}
                    <div className={`prose prose-sm max-w-full ${message.role === "user"
                      ? "prose-invert"
                      : "dark:prose-invert"
                      }`}>
                      <ReactMarkdown
                        components={{
                          // Style paragraphs to have better spacing
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                          ),
                          // Style bullet points to look better in chat
                          ul: ({ children }) => (
                            <ul className="mb-2 last:mb-0 space-y-1 pl-4">{children}</ul>
                          ),
                          // Style list items
                          li: ({ children }) => (
                            <li className="text-sm leading-relaxed flex items-start">
                              <span className="mr-2 mt-1 text-xs">•</span>
                              <span>{children}</span>
                            </li>
                          ),
                          // Style strong/bold text
                          strong: ({ children }) => (
                            <strong className="font-semibold">{children}</strong>
                          ),
                          // Remove default margins from headings if any
                          h1: ({ children }) => (
                            <h1 className="text-lg font-semibold mb-2 last:mb-0">{children}</h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-semibold mb-2 last:mb-0">{children}</h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-semibold mb-1 last:mb-0">{children}</h3>
                          ),
                          // Style code if present
                          code: ({ children }) => (
                            <code className={`px-1 py-0.5 rounded text-xs ${message.role === "user"
                              ? "bg-blue-500 bg-opacity-50"
                              : "bg-gray-300 dark:bg-gray-600"
                              }`}>
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {message.message}
                      </ReactMarkdown>
                    </div>
                    {message.role !== "user" && (
                      <div className="text-xs opacity-60 mt-2 text-right">
                        <button
                          onClick={() => handleCopy(message.message)}
                          className="ml-2"
                        >
                          {!copied ? (
                            <Copy className="w-4 h-4" />
                          ) : (
                            <CopyCheck className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {(isLoadingResponse || isCurrentlyLoadingTranscript) && (
              <div className="flex justify-start p-2">
                <div className="bg-gray-100 dark:bg-zinc-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <SyncLoader size={5} color="#FFFFFF" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50 dark:bg-[#2B2B2B] dark:border-zinc-700">
        <div className="flex space-x-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder={
              transcriptError
                ? "Try sending a message to retry..."
                : "Ask a question about this video..."
            }
            disabled={isLoadingResponse || isCurrentlyLoadingTranscript}
            className="flex-1 bg-white dark:bg-zinc-800 dark:text-white dark:placeholder:text-gray-400"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!canSendMessage || !currentMessage.trim()}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {(isLoadingResponse || isCurrentlyLoadingTranscript) ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Send className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}