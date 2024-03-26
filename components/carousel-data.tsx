import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CoursesList from "./courses-list";
import { Category, Course } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress?: number | null;
  totalReviews: number;
  courseReview: number;
};

interface CoursesListProps {
  data: CourseWithProgressWithCategory[];
}

export function CarouselData({ data }: CoursesListProps) {
  return (
    <Carousel
      opts={{
        align: "center",
      }}
      className="p-8"
    >
      <CarouselContent>
          <CarouselItem className="">
            <div className="p-1">
                  <CoursesList items={data} />
            </div>
          </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
