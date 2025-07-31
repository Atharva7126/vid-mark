'use client'

import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useScroll } from '@/hooks/use-scroll'
import ThemeToggleButton from '@/components/ui/theme-toggle-button'

const Navigation = () => {
  const pathname = usePathname()
  const scrolled = useScroll()

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-300 ease-in-out",
        scrolled && "top-4"
      )}
    >
      <nav
        className={cn(
          "flex w-full max-w-7xl items-center justify-between px-6 py-4 border-transparent text-sm font-medium transition-all duration-300 ease-in-out",
          scrolled
            ? "rounded-2xl w-11/12 bg-gray-200/90 dark:bg-zinc-900/90 shadow-sm backdrop-blur-md border-gray-200 dark:border-zinc-800"
            : "border-b border-zinc-800"
        )}
      >
        {/* Left: Navigation Links */}
        <div className="flex gap-6 text-muted-foreground transition-all duration-300 ease-in-out">
          <Link
            href="/video"
            className={cn(
              'hover:text-white transition-colors',
              pathname === '/video' && 'text-black dark:text-white'
            )}
          >
            Videos
          </Link>
          <Link
            href="/settings"
            className={cn(
              'hover:text-white transition-colors',
              pathname === '/settings' && 'text-black dark:text-white'
            )}
          >
            Settings
          </Link>
        </div>

        {/* Right: User + Theme */}
        <div className="flex items-center gap-4">
          <UserButton />
          <ThemeToggleButton start='top-right' variant='circle'  />
        </div>
      </nav>
    </div>
  )
}

export default Navigation
