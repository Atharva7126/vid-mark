'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { FlowButton } from '@/components/ui/flow-button'
import { useMediaQuery } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import { extractPlaylistId, extractVideoId, fetchChannel, fetchYouTubeData } from '@/lib/youtube'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

const AddVideo = () => {
  const [url, setUrl] = useState('')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const addVideo = useMutation(api.video.addVideo)
  const { user } = useUser()

  // console.log(fetchPlaylistDataWithVideos("PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w"))
  const type = url.split('?')[0].split('/')[3]
  console.log(type)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (type === 'watch' || type ==='live') {
      const videoId = extractVideoId(url)
      if (!videoId)
        return toast.error("Invalid YouTube URL", {
          duration: 3000,
          position: "top-right",
        })
      toast.promise(
        (async () => {
          const data = await fetchYouTubeData(videoId)
          const channelData = await fetchChannel(data.channelId)

          if (!user) throw new Error("You must be logged in")

          await addVideo({
            ...data,
            channelPicture: channelData.thumbnail,
          })

          setUrl("")
        })(),
        {
          loading: "Adding video...",
          success: "Video added!",
          error: (err) => {
            const msg = err.message || "Something went wrong";
            if (msg.includes("Video already exists")) {
              return "Video already exists";
            }
            return msg;
          },
          duration: 3000,
          position: "top-right",
        }
      )
    } else if (type === 'playlist') {
      const playlistId = extractPlaylistId(url)
      console.log(playlistId)
      toast.promise(
        (async () => {
          // const data = await fetchPlaylistDataWithVideos(playlistId as string)
          // console.log(data)

          setUrl("")
        })(),
        {
          loading: "Adding video...",
          success: "Feature coming soon... ",
          error: (err) => {
            const msg = err.message || "Something went wrong";
            if (msg.includes("Video already exists")) {
              return "Video already exists";
            }
            return msg;
          },
          duration: 3000,
          position: "top-right",
        }
      )
    }
  }


  return (
    <div className="border-b flex flex-col items-center px-4 py-20">
      <div className="w-full max-w-3xl rounded-2xl ">
        <h3 className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-10">
          Add a YouTube Video
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 sm:gap-3 w-full"
        >
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your YouTube video URL"
            className="rounded-2xl w-full sm:flex-1"
            required
          />
          <div className="w-full flex items-center justify-center sm:w-auto">
            {!isMobile ? (
              <FlowButton type="submit" text="Add" />
            ) : (
              <Button type="submit" className="w-full rounded-2xl">
                Add Video
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddVideo
