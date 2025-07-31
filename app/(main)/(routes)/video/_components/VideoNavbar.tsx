'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useMutation, useQuery } from 'convex/react'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { FaRegStar, FaStar } from "react-icons/fa"
import Link from 'next/link'
import Options from './options'

const VideoNavbar = () => {
  const pathname = usePathname()

  const videoId = pathname.split('/').pop() as Id<"videos">
  const video = useQuery(api.video.getVideoById, { id: videoId })
  const toggleStar = useMutation(api.video.toggleStar)

  const handleToggleStar = async () => {
    await toggleStar({ videoId })
  }

  if (!video) return null;

  return (
    <nav>
      <div
        className={cn(
          "flex flex-wrap md:flex-nowrap fixed top-0 w-full z-50 bg-white items-center justify-between px-4 py-3 dark:bg-[#1F1F1F] backdrop-blur-md",
        )}
      >
        <div>
          <Link href="/video" className="text-white flex items-center text-base font-semibold">
            <ArrowLeft className="inline-block w-5 h-5 mr-2 mt-[1px]" />
            Back to Videos
          </Link>
        </div>

        <div className="flex items-center space-x-3 mt-2 md:mt-0">
          {video.isCompleted && (<span className='mb-1'>
            <CheckCircle className="inline-block w-4 h-4 text-green-500" />
          </span>)}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleStar}
            className="cursor-pointer text-yellow-500"
          >
            {video?.stared ? (
              <FaStar className="w-5 h-5" />
            ) : (
              <FaRegStar className="w-5 h-5" />
            )}
          </Button>
          <Options initailData={video} />
        </div>
      </div>
    </nav>
  )
}

export default VideoNavbar
