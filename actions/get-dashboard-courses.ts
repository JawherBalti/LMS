import { db } from "@/lib/db"
import { Category, Chapter, Course, Review } from "@prisma/client"
import { getProgress } from "./get-progress"

type CourseWithProgressWithCategory = Course & {
    category: Category
    chapters: Chapter[]
    progress: number | null
    reviews: Review[] | null
    totalReviews: number
    courseReview: number
}

interface DashboardCourses {
    completedCourses: CourseWithProgressWithCategory[]
    coursesInProgress: CourseWithProgressWithCategory[]
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId
            },
            select: {
                course: {
                    include: {
                        reviews: true,
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        }
                    }
                }
            }
        })

        const courses = purchasedCourses.map(purchase => purchase.course) as CourseWithProgressWithCategory[]

        for (let course of courses) {
            const progress = await getProgress(userId, course.id)
            const totalReviews = course.reviews?.length
            const courseReview = totalReviews === 0 ? 0 : course.reviews?.reduce((acc, curr) => acc+ curr.review,0)! / totalReviews!
            course["progress"] = progress
            course["totalReviews"] = totalReviews!
            course["courseReview"] = courseReview!
        }

        const completedCourses = courses.filter(course => course.progress === 100)
        const coursesInProgress = courses.filter(course => (course.progress ?? 0) < 100)

        return {
            completedCourses,
            coursesInProgress
        }
    } catch (error) {
        return {
            completedCourses: [],
            coursesInProgress: []
        }
    }
}