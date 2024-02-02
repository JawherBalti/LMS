"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  subChapterId: string;
  chapterId: string;
  title: string;
  courseId: string;
  // nextChapterId: string;
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
  // nextChapterId,
  nextSubChapterId,
  playBackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter()
  const confetti = useConfettiStore()

  const onEnd = async () => {
    try {
if(completeOnEnd) {
  await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/subChapters/${subChapterId}/progress`, {
    isCompleted: true
  })

  // if(!nextChapterId) confetti.onOpen()

  toast.success("Progress updated")
  router.refresh()

  // if(nextChapterId) router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
  if(nextSubChapterId) router.push(`/courses/${courseId}/chapters/${chapterId}/subChapters/${nextSubChapterId}`)
}
    }catch {
      toast.error("Something went wrong")
    }
  }
  return (
    <div className="relative aspect-video">
      {!isLocked && !isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
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
          autoPlay
          playbackId={playBackId}
        />
      )}
    </div>
  );
};
