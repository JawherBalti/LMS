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

export const getFreeCourses = async (): Promise<CourseWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                price: {
                    equals: 0
                }
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
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const coursesWithProgress1: CourseWithCategory[] = await Promise.all(
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
        const coursesWithProgress2: CourseWithCategory[] = await Promise.all(
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
        const coursesWithProgress3: CourseWithCategory[] = await Promise.all(
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

        return [...coursesWithProgress, ...coursesWithProgress2, ...coursesWithProgress3, ...coursesWithProgress1]
    } catch (error) {
        return []
    }
}