"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { AlertTriangle, CheckCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseActionsProps {
  courseId: string;
  isPending: boolean;
  isPublished: boolean;
}
const PreviewActions = ({
  courseId,
  isPending,
  isPublished,
}: CourseActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const confetti = useConfettiStore();
  const router = useRouter();
  const { toast } = useToast();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast({
        title: "Course deleted",
        description: "You have deleted a course",
        action: (
          <CheckCircle className="text-emerald-600 dark:text-emerald-600" />
        ),
        className: "border-black dark:border-white",
      });
      router.refresh();
      router.push(`/admin/courses`);
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

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPending && !isPublished) {
        await axios.patch(`/api/courses/${courseId}/publish`,{isAdmin: true});
        toast({
          title: "Course published",
          description: "You have published the course",
          action: (
            <CheckCircle className="text-emerald-600 dark:text-emerald-600" />
          ),
          className: "border-black dark:border-white",
        });
      } else {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast({
          title: "Course published",
          description: "You have unpublished the course",
          action: (
            <CheckCircle className="text-emerald-600 dark:text-emerald-600" />
          ),
          className: "border-black dark:border-white",
        });
        confetti.onOpen();
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
    <div className="pt-8 flex items-center justify-between">
      <Button
        onClick={onClick}
        disabled={ isLoading}
        variant="outline"
        size="sm"
      >
        {isPending && !isPublished ? "Publish" : "Unpublish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default PreviewActions;
