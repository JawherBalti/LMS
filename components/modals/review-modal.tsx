// ReviewModal.tsx
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";
import { Stars } from "./stars";
import { useToast } from "../ui/use-toast";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ReviewModalProps {
  children: React.ReactNode;
  courseId: string;
}

export const ReviewModal = ({ children, courseId }: ReviewModalProps) => {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [review, setReview] = useState("");
  const [reviewValue, setReviewValue] = useState(-1);
  const { toast } = useToast();

  const handleSubmitReview = async () => {
    try {
      await axios.post(`/api/courses/${courseId}/review`, { reviewValue });
      toast({
        title: "You have rated this course",
        description: "Thank you for your feedback",
        action: <CheckCircle className="text-emerald-600 dark:text-emerald-600"/>,
        className: "border-black dark:border-white",
      });
    } catch {
      toast({
        title: "Something went wrong",
        action: <AlertTriangle className="text-red-600 dark:text-red-600"/>,
        className: "border-black dark:border-white",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="ml-auto mr-auto">
            How would you rate this course overall?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Stars
          review={review}
          setReview={setReview}
          setReviewValue={setReviewValue}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={reviewValue===-1} onClick={handleSubmitReview}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
