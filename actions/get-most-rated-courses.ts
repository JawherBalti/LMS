import { db } from "@/lib/db";
import { Category, Course, Review } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithCategory = Course & {
    category: Category | null
    chapters: { id: string }[]
    reviews: Review[] | null
    totalReviews: number
    courseReview: number
}

export const getMostRatedCourses = async (): Promise<CourseWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            include: {
                category: true,
                reviews: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
            },
            // take: 6
        })

        const coursesWithProgress: CourseWithCategory[] = await Promise.all(
            courses.map(async course => {
                const totalReviews = course.reviews.length
                const courseReview = totalReviews === 0 ? 0 : course.reviews.reduce((acc, curr) => acc + curr.review, 0) / totalReviews

                return {
                    ...course,
                    totalReviews,
                    progress: null,
                    courseReview,
                }
            })
        )
     
        return coursesWithProgress.sort((a,b) => b.courseReview - a.courseReview)
    } catch (error) {
        return []
    }
}