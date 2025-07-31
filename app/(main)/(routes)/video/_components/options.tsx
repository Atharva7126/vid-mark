import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle, EllipsisVertical, Trash } from 'lucide-react'
import { Doc } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { ConfirmModal } from '@/components/modals/confirm-modal'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OptionsProps {
    initailData: Doc<"videos">
}

const Options = ({
    initailData
}: OptionsProps) => {
    const deleteVideo = useMutation(api.video.deleteVideo)
    const markAsCompleted = useMutation(api.video.markAsCompleted)
    const router = useRouter()

    const handleDelete = async () => {
        if (!initailData) return;
        toast.promise(
            (async () => {
                router.push('/video')
                await deleteVideo({ id: initailData._id })
            })(),
            {
                loading: "Deleting video...",
                success: "Video deleted successfully!",
                error: "Failed to delete video",
                duration: 3000,
                position: "top-right",
            }
        )
    }

    const onMarkAsCompleted = async () => {
        if (!initailData) return;
        await markAsCompleted({ id: initailData._id })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical className="w-5 h-5 text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {!initailData.isCompleted && (
                    <DropdownMenuItem onClick={onMarkAsCompleted}>
                        <CheckCircle size={16} className="text-green-500" />
                        Mark as completed
                    </DropdownMenuItem>
                )}
                <ConfirmModal onConfirm={handleDelete}>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Trash size={16} className='text-red-500' />
                        Delete
                    </DropdownMenuItem>
                </ConfirmModal>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Options
