"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Check, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  subChapterId: string;
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  // nextChapterId?: string;
  nextSubChapterId?: string;
}
const CourseProgressButton = ({
  subChapterId,
  chapterId,
  courseId,
  isCompleted,
  // nextChapterId,
  nextSubChapterId,
}: CourseProgressButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();
  const Icon = isCompleted ? Circle : Check;

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/subChapters/${subChapterId}/progress`,
        {
          isCompleted: !isCompleted,
        });

      // if (!isCompleted && !nextChapterId) confetti.onOpen();
      

      if (!isCompleted && nextSubChapterId) router.push(`/courses/${courseId}/chapters/${chapterId}/subChapters/${nextSubChapterId}`);
      
      toast.success("Progress updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
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
