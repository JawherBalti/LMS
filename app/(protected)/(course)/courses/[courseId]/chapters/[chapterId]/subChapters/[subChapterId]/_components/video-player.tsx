"use client";

import { useToast } from "@/components/ui/use-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Chapter, SubChapter } from "@prisma/client";
import axios from "axios";
import { AlertTriangle, CheckCircle, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface VideoPlayerProps {
  subChapterId: string;
  chapterId: string;
  title: string;
  courseId: string;
  nextChapter: Chapter & {
    subChapters: SubChapter[];
  };
  nextSubChapterId: string;
  playBackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

export const VideoPlayer = ({
  subChapterId,
  chapterId,
  title,
  courseId,
  nextChapter,
  nextSubChapterId,
  playBackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();

  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/subChapters/${subChapterId}/progress`,
          {
            isCompleted: true,
          }
        );

        if (!nextChapter && !nextSubChapterId) confetti.onOpen();
        if (nextSubChapterId)
          router.push(
            `/courses/${courseId}/chapters/${chapterId}/subChapters/${nextSubChapterId}`
          );
        if (!nextSubChapterId && nextChapter)
          router.push(
            `/courses/${courseId}/chapters/${nextChapter.id}/subChapters/${nextChapter.subChapters[0].id}`
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
      {!isLocked && !isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary dark:text-foreground " />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked.</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden", "aspect-video")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay={false}
          playbackId={playBackId}
        />
      )}
    </div>
  );
};
