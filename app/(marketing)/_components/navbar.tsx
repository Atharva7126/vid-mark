"use client"
import React from 'react'
import { cn } from '@/lib/utils'
import { useScroll } from '@/hooks/use-scroll'
import Link from 'next/link'
import { useConvexAuth } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import ThemeToggleButton from '@/components/ui/theme-toggle-button'

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const scrolled = useScroll()

  return (
    <div
      className={cn(
        "fixed top-0 w-full bg-background dark:bg-[#1F1F1F] transition-all duration-100 ease-in-out border-transparent z-50",
        scrolled && "border-b shadow-sm"
      )}
    >
      <div
        className={cn(
          "flex items-center px-4 py-4 transition-all duration-100 ease-in-out justify-between",
          scrolled ? "sm:gap-32" : "sm:gap-4"
        )}
      >
        <div
          className={cn(
            "font-bold text-2xl dark:text-[#fffff3] transition-all duration-100",
            scrolled ? "sm:ml-12" : "sm:ml-0"
          )}
        >
          <Link href="/">
            VidMark
          </Link>
        </div>
        <div className={cn(scrolled ? "sm:mr-12" : "sm:mr-0", " flex justify-center items-center transition-all space-x-4 duration-100")}>
          {isLoading && (
            <Skeleton className='w-8 h-8 rounded-full' />
          )}
          {!isAuthenticated && !isLoading && (
            <SignInButton mode="modal">
              <Button className="group dark:bg-[#fffff3] cursor-pointer relative overflow-hidden">
                <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
                  Login
                </span>
                <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-300 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                  <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                </i>
              </Button>
            </SignInButton>
          )}
          {isAuthenticated && !isLoading && (
            <UserButton />
          )}
          <ThemeToggleButton start='top-right' variant='circle'  />
        </div>
      </div>
    </div>
  )
}

export default Navbar
