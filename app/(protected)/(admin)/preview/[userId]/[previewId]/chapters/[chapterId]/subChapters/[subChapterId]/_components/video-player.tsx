"use client";

import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Chapter, SubChapter } from "@prisma/client";
import { AlertTriangle, CheckCircle, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapter: Chapter & {
    subChapters: SubChapter[];
  };
  nextSubChapterId: string;
  playBackId: string;
  completeOnEnd: boolean;
}

export const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapter,
  nextSubChapterId,
  playBackId,
  completeOnEnd,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();

  const router = useRouter();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        if (nextSubChapterId)
          router.push(
            `/preview/${courseId}/chapters/${chapterId}/subChapters/${nextSubChapterId}`
          );
        if (!nextSubChapterId && nextChapter)
          router.push(
            `/preview/${courseId}/chapters/${nextChapter.id}/subChapters/${nextChapter.subChapters[0].id}`
          );

          toast({
            title: "Progress updated",
            description: "You have made progress in this course",
            action: <CheckCircle className="text-emerald-600 dark:text-emerald-600"/>,
            className: "border-black dark:border-white",
          });
        router.refresh();
      }
    } catch(error) {
      toast({
        title: "Something went wrong",
        action: <AlertTriangle className="text-red-600 dark:text-red-600" />,
        className: "border-black dark:border-white",
      });
    }
  };
  return (
    <div className="relative aspect-video">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary dark:text-foreground " />
        </div>
      )}
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden", "aspect-video")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay={false}
          playbackId={playBackId}
        />
    </div>
  );
};
