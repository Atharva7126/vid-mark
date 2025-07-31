"use client"

import React from "react"
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { StatCard } from "./_components/StatCard"

const SettingsPage = () => {
  const TotalWatching = useQuery(api.video.getWatchStats)
  const TotalStaredVideo = useQuery(api.video.GetStaredVideos)
  const TotalCompletedVideo = useQuery(api.video.GetCompletedVideos)
  const TotalVideoMarked = useQuery(api.video.listByUser)

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pt-15">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hours Watching"
          value={formatDuration(Number(TotalWatching ?? 0))}
          isLoading={TotalWatching === undefined}
        />
        <StatCard
          title="Total Marked"
          value={Number(TotalVideoMarked?.length ?? 0)}
          isLoading={TotalVideoMarked === undefined}
        />
        <StatCard
          title="Total Completed"
          value={TotalCompletedVideo?.length ?? 0}
          isLoading={TotalCompletedVideo === undefined}
        />
        <StatCard
          title="Total Starred"
          value={TotalStaredVideo?.length ?? 0}
          isLoading={TotalStaredVideo === undefined}
        />
      </div>
    </div>
  )
}

export default SettingsPage
