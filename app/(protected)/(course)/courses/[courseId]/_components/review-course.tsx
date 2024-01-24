"use client";

import { ReviewModal } from "@/components/modals/review-modal";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useParams } from "next/navigation";

const ReviewCourse = () => {
const params = useParams()
  return (
    <ReviewModal courseId={params.courseId as string}>
      <Button className="mt-4 flex items-center gap-x-2">
        <Star
          fill="rgb(234 179 8 / var(--tw-text-opacity))"
          className=" text-yellow-500"
        />
        Rate this course
      </Button>
    </ReviewModal>
  );
};

export default ReviewCourse;
