'use client'

import React, { useRef, useEffect, useState } from 'react'
import YouTube from 'react-youtube'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface VideoPlayerProps {
    videoId: string
    savedTime?: number
    videoDocId: Id<"videos">
}

const VideoPlayer = ({
    videoId,
    savedTime = 0,
    videoDocId
}: VideoPlayerProps) => {
    const playerRef = useRef<any>(null)
    const [lastSaved, setLastSaved] = useState(0)
    const updateProgress = useMutation(api.video.updateProgress)

    const handleReady = (event: any) => {
        playerRef.current = event.target
        if (savedTime > 0) {
            event.target.seekTo(savedTime, true)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (!playerRef.current || !playerRef.current.getCurrentTime || !videoDocId) return

            const currentTime = Math.floor(playerRef.current.getCurrentTime())

            if (!isNaN(currentTime) && Math.abs(currentTime - lastSaved) >= 10) {
                updateProgress({ id: videoDocId, time: currentTime })
                setLastSaved(currentTime)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [videoDocId])

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0, // Auto-play the video
            controls: 1, // Show controls
            rel: 0, // Disable related videos
            modestbranding: 1, // reduces YouTube branding
        },
    }

    return (
        <div className="w-full rounded-lg aspect-video">
            <YouTube
                videoId={videoId}
                opts={opts}
                onReady={handleReady}
                className="w-full h-full"
            />
        </div>
    )
}

export default VideoPlayer
