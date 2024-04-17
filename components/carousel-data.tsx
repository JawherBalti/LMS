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
import { CourseCard } from "./course-card";

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
        {data.map((item) => (
          <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/4">
            <CourseCard
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl!}
              chaptersLength={item.chapters.length}
              price={item.price!}
              progress={item.progress!}
              category={item?.category?.name!}
              totalReviews={item.totalReviews}
              courseReview={item.courseReview}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="border-foreground" />
      <CarouselNext className="border-foreground" />
    </Carousel>
  );
}
