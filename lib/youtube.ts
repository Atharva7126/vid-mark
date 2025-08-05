interface PlaylistItem {
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      [key: string]: { url: string };
    };
  };
  contentDetails: {
    videoId: string;
  };
}

interface EnrichedVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  channelTitle: string;
  channelId: string;
}

export function extractVideoId(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:live\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export const extractPlaylistId = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    const playlistId = parsedUrl.searchParams.get("list");
    return playlistId || null;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

export function parseISO8601(duration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = duration.match(regex);

  if (!match) return 0;

  const hours = parseInt(match[1] ?? '0', 10);
  const minutes = parseInt(match[2] ?? '0', 10);
  const seconds = parseInt(match[3] ?? '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}

export const fetchYouTubeData = async (videoId: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,liveStreamingDetails&id=${videoId}&key=${API_KEY}`
  );
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found');
  }

  const item = data.items[0];
  return {
    videoId: item.id,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    duration: item.contentDetails.duration,
    channelTitle: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
  };
};

export const fetchPlaylistDataWithVideos = async (playlistId: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  // Fetch playlist metadata
  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
  );
  const playlistData = await playlistRes.json();

  if (!playlistData.items || playlistData.items.length === 0) {
    throw new Error('Playlist not found');
  }

  const playlist = playlistData.items[0];

  // Fetch channel profile
  const channelThumbnail = await fetchChannel(playlist.snippet.channelId)

  // Fetch all videos in the playlist
  let nextPageToken = '';
  const allItems: PlaylistItem[] = [];
  let totalResults

  do {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${API_KEY}`
    );
    const data = await res.json();

    if (!data.items) {
      throw new Error('No playlist items found');
    }

    allItems.push(...data.items);
    totalResults = data.pageInfo.totalResults
    nextPageToken = data.nextPageToken || '';
  } while (nextPageToken);

  // Fetch video details (duration, etc.) using your existing function
  const videoIds = allItems.map(item => item.contentDetails.videoId);

  const enrichedVideos: EnrichedVideo[] = [];
  const chunkSize = 50;

  for (let i = 0; i < videoIds.length; i += chunkSize) {
    const chunk = videoIds.slice(i, i + chunkSize);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${chunk.join(',')}&key=${API_KEY}`
    );
    const data = await res.json();

    if (!data.items) continue;

    for (const item of data.items) {
      enrichedVideos.push({
        videoId: item.id,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.default?.url,
        duration: item.contentDetails.duration,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
      });
    }
  }

  return {
    playlist: {
      playlistId: playlist.id,
      title: playlist.snippet.title,
      totalVideos: totalResults,
      thumbnail:
        playlist.snippet.thumbnails?.high?.url ||
        playlist.snippet.thumbnails?.default?.url,
      channelTitle: playlist.snippet.channelTitle,
      channelId: playlist.snippet.channelId,
      channelThumbnail: channelThumbnail.thumbnail,
      videos: enrichedVideos,
    },
  };
};

export const fetchChannel = async (channelId: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`
  );

  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found');
  }

  const item = data.items[0];
  return {
    thumbnail: item.snippet.thumbnails.default.url,
  }
}


export async function fetchTranscriptFromStrapi(id: string): Promise<string> {
  const videoId = id
  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  const apiUrl = `https://deserving-harmony-9f5ca04daf.strapiapp.com/utilai/yt-transcript/${videoId}`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`Transcript fetch failed (status ${res.status})`);

  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Unexpected transcript format");
    return data.map((item: { text: string }) => item.text).join(" ");
  }

  // fallback for plain text
  return await res.text();
}

