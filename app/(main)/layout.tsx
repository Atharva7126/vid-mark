"use client"

import { Spinner } from '@/components/spinner'
import { useConvexAuth } from 'convex/react'
import { redirect, usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'
import Navigation from './_components/navigation'
import VideoNavbar from './(routes)/video/_components/VideoNavbar'
import { SearchCommand } from '@/components/search-command'

const MainLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const pathname = usePathname()

  if (isLoading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return redirect("/")
  }

  // Check if pathname matches /video/<videoId>
  const isVideoPage = /^\/video\/[^\/]+$/.test(pathname)

  return (
    <div className='min-h-screen flex flex-col dark:bg-[#1F1F1F]'>
      {!isVideoPage ? <Navigation />: <VideoNavbar />}
      <main
        className={cn(
          !isVideoPage && "flex-1 pt-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 w-full max-w-screen-2xl mx-auto"
        )}
      >
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout
