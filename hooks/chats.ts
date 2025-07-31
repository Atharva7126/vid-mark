import { create } from 'zustand';

type ChatStore = {
  ChatHistory: Record<string, any[]>; 
  transcripts: Record<string, string>;
  setChatHistory: (videoId: string, messages: any[]) => void;
  setTranscript: (videoId: string, transcript: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  ChatHistory: {},
  transcripts: {},
  setChatHistory: (videoId, messages) =>
    set((state) => ({
      ChatHistory: { ...state.ChatHistory, [videoId]: messages },
    })),
  setTranscript: (videoId, transcript) =>
    set((state) => ({
      transcripts: { ...state.transcripts, [videoId]: transcript },
    })),
}));
