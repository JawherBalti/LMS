"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Chapter, SubChapter } from "@prisma/client";
import axios from "axios";
import { AlertTriangle, Check, CheckCircle, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseProgressButtonProps {
  subChapterId: string;
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapter: Chapter & {
    subChapters: SubChapter[];
  };
  nextSubChapterId?: string;
}
const CourseProgressButton = ({
  subChapterId,
  chapterId,
  courseId,
  isCompleted,
  nextChapter,
  nextSubChapterId,
}: CourseProgressButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const router = useRouter();
  const confetti = useConfettiStore();
  const Icon = isCompleted ? Circle : Check;

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/subChapters/${subChapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );

      if (!isCompleted && !nextChapter && !nextSubChapterId) confetti.onOpen();

      if (!isCompleted && !nextSubChapterId && nextChapter)
        router.push(
          `/courses/${courseId}/chapters/${nextChapter.id}/subChapters/${nextChapter.subChapters[0].id}`
        );

      if (!isCompleted && nextSubChapterId)
        router.push(
          `/courses/${courseId}/chapters/${chapterId}/subChapters/${nextSubChapterId}`
        );

if(!isCompleted) {
  toast({
    title: "Progress updated",
    description: "You have made progress in this course",
    action: (
      <CheckCircle className="text-emerald-600 dark:text-emerald-600" />
    ),
    className: "border-black dark:border-white",
  });
} else {
  toast({
    title: "Progress updated",
    action: (
      <CheckCircle className="text-emerald-600 dark:text-emerald-600" />
    ),
    className: "border-black dark:border-white",
  });
}
      router.refresh();
    } catch {
      toast({
        title: "Something went wrong",
        action: <AlertTriangle className="text-red-600 dark:text-red-600" />,
        className: "border-black dark:border-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full md:w-auto"
      type="button"
      variant={isCompleted ? "outline" : "success"}
    >
      {isCompleted ? "Mark as not completed" : "Mark as complete"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};

export default CourseProgressButton;
