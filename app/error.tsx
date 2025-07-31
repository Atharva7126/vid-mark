"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h4 className="text-2xl font-bold mb-4">Video not found</h4>
      <Link href="/video">
        <Button className="bg-primary text-white dark:text-black px-4 py-2 rounded hover:bg-primary/90 transition-colors">
          Go to Videos
        </Button>
      </Link>
    </div>
  )
}

export default Error
