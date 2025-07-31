// hooks/useVideoChat.ts
import { useState, useRef } from "react";
import { chatWithVideo } from "@/app/(main)/(routes)/ai/flows/chat-video";
import { fetchTranscriptFromStrapi } from "@/lib/youtube";

interface UseVideoChatProps {
  youtubeVideoId: string;
  cachedTranscript?: string;
}

interface UseVideoChatReturn {
  transcript: string | null;
  isLoadingTranscript: boolean;
  transcriptError: string | null;
  sendMessage: (message: string, chatHistory: any[]) => Promise<string>;
  isLoadingResponse: boolean;
}

export function useVideoChat({ youtubeVideoId, cachedTranscript }: UseVideoChatProps): UseVideoChatReturn {
  // Store transcript in memory (not in database)
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  // Use ref to prevent multiple fetches
  const fetchingRef = useRef(false);

  // Function to fetch transcript when needed
  const ensureTranscriptLoaded = async (): Promise<string> => {
    // If we already have transcript, return it
    if (transcript) {
      return transcript;
    }

    // If already fetching, wait for it
    if (fetchingRef.current) {
      return new Promise((resolve, reject) => {
        const checkTranscript = () => {
          if (transcript) {
            resolve(transcript);
          } else if (transcriptError) {
            reject(new Error(transcriptError));
          } else {
            setTimeout(checkTranscript, 100); // Check again in 100ms
          }
        };
        checkTranscript();
      });
    }

    if (cachedTranscript) {
      setTranscript(cachedTranscript);
      return cachedTranscript;
    }

    // Start fetching
    fetchingRef.current = true;
    setIsLoadingTranscript(true);
    setTranscriptError(null);

    try {
      const fetchedTranscript = await fetchTranscriptFromStrapi(youtubeVideoId);
      setTranscript(fetchedTranscript);
      return fetchedTranscript;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch transcript";
      setTranscriptError(errorMessage);
      throw error;
    } finally {
      setIsLoadingTranscript(false);
      fetchingRef.current = false;
    }
  };

  // Function to send message and get AI response
  const sendMessage = async (userMessage: string, chatHistory: any[]): Promise<string> => {
    setIsLoadingResponse(true);

    try {
      // Ensure transcript is loaded first
      const currentTranscript = await ensureTranscriptLoaded();

      // Get AI response
      const aiResponse = await chatWithVideo({
        userMessage,
        transcript: currentTranscript,
        chatHistory,
      });

      return aiResponse.response;
    } finally {
      setIsLoadingResponse(false);
    }
  };

  return {
    transcript,
    isLoadingTranscript,
    transcriptError,
    sendMessage,
    isLoadingResponse,
  };
}