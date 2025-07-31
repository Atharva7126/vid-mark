"use client"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import { useSearch } from "@/hooks/use-search"
import { api } from "@/convex/_generated/api"
import { FaRegStar, FaStar } from "react-icons/fa"
import { CheckCircle, Trash } from "lucide-react"
import { Button } from "./ui/button"
import { ConfirmModal } from "./modals/confirm-modal"

export const SearchCommand = () => {
    const router = useRouter()
    const video = useQuery(api.video.listByUser, {})
    const toggleStar = useMutation(api.video.toggleStar)
    const deleteVideo = useMutation(api.video.deleteVideo)

    const [isMounted, setIsMounted] = useState(false)

    const toggle = useSearch((store) => store.toggle)
    const isOpen = useSearch((store) => store.isOpen)
    const onClose = useSearch((store) => store.onClose)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    //   const handleToggleStar = async () => {
    //     
    //   }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                toggle()
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [toggle])

    if (!isMounted) return null

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput placeholder={`Search videos...`} />
            <CommandGroup heading="Videos">
                {video?.map((video) => (
                    <CommandItem
                        key={video._id}
                        onSelect={() => {
                            router.push(`/video/${video._id}?id=${video.videoId}`)
                            onClose()
                        }}
                        className="flex items-center justify-between px-2 py-2"
                    >
                        {/* Left Side: Thumbnail + Title */}
                        <div className="flex items-center gap-3 overflow-hidden">
                            {video.channelPicture && (
                                <Image
                                    width={24}
                                    height={24}
                                    src={video.channelPicture}
                                    alt={video.channelTitle}
                                    className="rounded-full"
                                />
                            )}
                            <span className="truncate text-sm font-medium">{video.title}</span>
                        </div>

                        {/* Right Side: Actions */}
                        <div className="flex items-center">
                            {video.isCompleted && (<span className="mr-2">
                                <CheckCircle size={16} className="text-green-500"/>
                            </span>)}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={async (e) => {
                                    e.stopPropagation()
                                    await toggleStar({ videoId: video._id })
                                }}
                                className="cursor-pointer hover:scale-110 transition-transform"
                            >
                                {video.stared ? (
                                    <FaStar className="w-5 h-5 text-yellow-500" />
                                ) : (
                                    <FaRegStar className="w-5 h-5 text-yellow-500" />
                                )}
                            </Button>

                            <ConfirmModal onConfirm={() => deleteVideo({ id: video._id })}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="cursor-pointer hover:scale-110 transition-transform"
                                >
                                    <Trash size={16} className="text-red-500" />
                                </Button>
                            </ConfirmModal>
                        </div>
                    </CommandItem>
                ))}
            </CommandGroup>
            <CommandEmpty>No results found</CommandEmpty>
        </CommandDialog>
    )
}
