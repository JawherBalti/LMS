import { db } from "@/lib/db";
import { Category, Course, Review } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category | null
    chapters: { id: string }[]
    progress: number | null
    reviews: Review[] | null
    totalReviews: number
    courseReview: number
}

type GetCourses = {
    userId: string
    title?: string
    categoryId?: string
}

export const getCourses = async ({
    userId,
    title,
    categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId
            },
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
                purchases: {
                    where: {
                        userId
                    }
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                const totalReviews = course.reviews.length
                const courseReview = totalReviews === 0 ? 0 : course.reviews.reduce((acc, curr)=> acc+ curr.review, 0) / totalReviews

                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        totalReviews,
                        courseReview,
                        progress: null,
                    }
                }
                const progressPercentage = await getProgress(userId, course.id)
                return {
                    ...course,
                    totalReviews,
                    courseReview,
                    progress: progressPercentage
                }
            })
        )

        return coursesWithProgress
    } catch (error) {
        return []
    }
}