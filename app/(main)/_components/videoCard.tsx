import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FaRegStar, FaStar } from "react-icons/fa"; // import both icons
import Image from 'next/image';
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { CheckCircle, Trash, Video } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { toast } from 'sonner';
import { parseISO8601 } from '@/lib/youtube';
import { Progress } from '@/components/ui/progress';

type Video = Doc<"videos">;

interface VideoProps {
  video: Video;
};

const VideoCard = ({ video }: VideoProps) => {
  const toggleStar = useMutation(api.video.toggleStar);
  const deleteVideo = useMutation(api.video.deleteVideo);
  const deleteChats = useMutation(api.chats.deleteChats);
  const router = useRouter()

  const onClick = () => {
    router.push(`/video/${video._id}?id=${video.videoId}`)
  }

  const hanldeToggleStar = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await toggleStar({ videoId: video._id });
  }

const handleDelete = async () => {
  toast.promise(
    (async () => {
      await deleteVideo({ id: video._id });
      await deleteChats({ videoId: video._id });
    })(),
    {
      loading: "Deleting video...",
      success: "Video deleted successfully!",
      error: "Failed to delete video",
      duration: 3000,
      position: "top-right",
    }
  );
};

  const getPercentage = (videoDuration: number, isProgressed: number) => {
    if (videoDuration === 0) return 0; // Avoid division by zero
    return Math.min(Math.round((isProgressed / videoDuration) * 100), 100);
  }

  return (
    <div onClick={onClick} className={cn(
      "relative border-2 border-transparent cursor-pointer hover:scale-102 transition-all rounded-xl overflow-hidden",
      video.stared && "border-2 border-yellow-500"
    )}>
      <Image
        width={300}
        height={300}
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg truncate font-bold">{video.title}</h3>
        <div className="flex items-center justify-between">
          <div className='flex items-center gap-2'>
            <Image
              width={26}
              height={26}
              src={video.channelPicture || ''}
              alt={video.channelTitle}
              className="rounded-full"
            />
            <span className='text-muted-foreground truncate max-w-[160px]'>{video.channelTitle}</span>
          </div>
          <div className='text-sm items-center justify-center flex'>
            {video.isCompleted && (
              <div className='text-green-500 mr-2'>
                <CheckCircle className='w-4 h-4' />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={hanldeToggleStar}
              className="cursor-pointer  text-yellow-500"
            >
              {video.stared ? (
                <FaStar className="w-5 h-5" />
              ) : (
                <FaRegStar className="w-5 h-5" />
              )}
            </Button>
            <ConfirmModal onConfirm={handleDelete}>
              <Button
                variant="ghost"
                size="icon"
                className=" cursor-pointer text-red-500 "
              >
                <Trash className=" w-5 h-5" />
              </Button>
            </ConfirmModal>
          </div>
        </div>
        <Progress
          value={video.isCompleted ? 100 : getPercentage(parseISO8601(video.duration), video.watchProgress ?? 0)}
          className={cn(
            "mt-2",
            video.isCompleted
              ? "bg-muted [&>div]:bg-green-600"
              : "bg-muted [&>div]:bg-yellow-500"
          )}
        />

      </div>
    </div>
  );
};

export default VideoCard;

VideoCard.Skeleton = (() => {
  return (
    <div className="relative border rounded-xl overflow-hidden shadow-sm w-full max-w-sm">
      <Skeleton className="w-full h-40" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="absolute bottom-2 right-2 h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}) as React.FC;

VideoCard.Skeleton.displayName = "VideoCardSkeleton";
