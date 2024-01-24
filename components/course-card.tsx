import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen, Star } from "lucide-react";
import { formatCourseReview, formatPrice, formatTotalReviews } from "@/lib/format";
import CourseProgress from "./course-progress";
import { Badge } from "./ui/badge";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
  totalReviews: number;
  courseReview: number;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  totalReviews,
  courseReview,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="flex flex-col group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            sizes="100%"
            fill
            className="object-cover"
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2 break-words">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          {progress !== null ? (
            <CourseProgress
              size="sm"
              value={progress}
              variant={progress === 100 ? "success" : "default"}
            />
          ) : price === 0 ? (
            <Badge className="w-12">Free</Badge>
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700 dark:text-secondary">
              {formatPrice(price)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between ">
          <span className="flex items-center gap-x-1">
            {formatCourseReview(courseReview)}
            <Star
              size={20}
              fill="rgb(234 179 8 / var(--tw-text-opacity))"
              className=" text-yellow-500"
            />
          </span>
          <span className="text-xs text-muted-foreground">
            ({formatTotalReviews(totalReviews)} {totalReviews > 1 ? "Reviews" : "Review"})
          </span>
        </div>
      </div>
    </Link>
  );
};
