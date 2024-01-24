import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const user = await currentUser()
        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })
        const { reviewValue } = await req.json()

        const userReview = await db.review.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        })

        if (userReview) {
            const updateReview = await db.review.update({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: params.courseId
                    }
                },
                data: {
                    review: reviewValue
                }
            })
            return NextResponse.json(updateReview)

        } else {
            const newReview = await db.review.create({
                data: {
                    userId: user.id,
                    courseId: params.courseId,
                    review: reviewValue
                }
            })
            return NextResponse.json(newReview)
        }


    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}