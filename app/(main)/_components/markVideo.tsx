"use client"
import React from 'react'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import VideoCard from './videoCard' // Assume you have this

const MarkVideo = ({ filter }: { filter: "all" | "completed" | "watching" | "stared" }) => {

    const all = useQuery(api.video.listByUser, {})
    const completed = useQuery(api.video.GetCompletedVideos)
    const watching = useQuery(api.video.GetisWatchingVideos)
    const stared = useQuery(api.video.GetStaredVideos)

    let videos = all
    if (filter === "completed") videos = completed
    else if (filter === "watching") videos = watching
    else if (filter === "stared") videos = stared

    if (videos === undefined) {
        return (
            <div className="grid mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: all?.length ?? 4 }).map((_, index) => (
                        <VideoCard.Skeleton key={index} />
                    ))
                }
            </div>
        )
    }

    if (videos.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p className="text-lg font-medium">No videos found</p>
      </div>
    );
  }

    return (
        <div className="grid mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map(video => (
                <VideoCard key={video._id} video={video} />
            ))}
        </div>
    )
}

export default MarkVideo
