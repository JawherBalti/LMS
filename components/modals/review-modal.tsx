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
import toast from "react-hot-toast";
import { Stars } from "./stars";

interface ReviewModalProps {
 children: React.ReactNode;
 courseId: string;
}

export const ReviewModal = ({ children, courseId }: ReviewModalProps) => {
 const [hoverIndex, setHoverIndex] = useState(-1);
 const [review, setReview] = useState("");
 const [reviewValue, setReviewValue] = useState(-1);

 const handleSubmitReview = async () => {
    try {
      await axios.post(`/api/courses/${courseId}/review`, { reviewValue });
      toast.success("Thank you for your feedback")
    } catch {
      toast.error("Something went wrong")
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

        <Stars review={review} setReview={setReview} setReviewValue={setReviewValue} hoverIndex={hoverIndex} setHoverIndex={setHoverIndex} />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmitReview}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
 );
};
