"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}
const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast()

  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (price === 0) {
        await axios.post(`/api/courses/${courseId}/purchase`, { courseId });
        router.refresh();
      } else {
        const response = await axios.post(`/api/courses/${courseId}/checkout`);
        window.location.assign(response.data.url);
      }
    } catch {
      toast({
        title: "Something went wrong",
        action: <AlertTriangle className="text-red-600 dark:text-red-600"/>,
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
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price!)}
    </Button>
  );
};

export default CourseEnrollButton;
