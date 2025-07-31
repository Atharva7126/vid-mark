"use client"
import React, { useState } from 'react'
import AddVideo from '../../_components/addVideo'
import MarkVideo from '../../_components/markVideo'
import { FilterToggle } from '../../_components/filter'
import { Search } from 'lucide-react'
import { useSearch } from '@/hooks/use-search'
import { useMediaQuery } from 'usehooks-ts'

const Video = () => {
    const [filter, setFilter] = useState<"all" | "completed" | "watching" | "stared">("all")
    const search = useSearch()

    return (
        <div className='h-full px-4 sm:px-10'>
            <AddVideo />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className='text-3xl font-bold my-8'>Your Videos</h2>
                <div className="flex gap-2 mb-6 sm:mb-0">
                    <div onClick={search.onOpen} className='flex cursor-pointer items-center gap-2 bg-white dark:bg-[#2F2F2F] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 shadow-sm'>
                        <Search className='w-4 h-4' />
                        <span className='text-muted-foreground text-base'>Search Video</span>
                        {/* {!isMobile && (
                            <span className='ml-2 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs font-mono text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'>
                                ⌘ <span className='text-base'>+ K</span>
                            </span>
                        )} */}
                    </div>
                    <FilterToggle setFilter={setFilter} />
                </div>
            </div>
            <MarkVideo filter={filter} />
        </div>
    )
}

export default Video
