import { db } from "@/lib/db"

interface GetCommentsProps {
    courseId: string
}

export const getComments = async ({
    courseId
}: GetCommentsProps) => {
    try {
        const comments = await db.comment.findMany({
            where: {
                courseId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return comments

    } catch (error) {
        return []
    }
}