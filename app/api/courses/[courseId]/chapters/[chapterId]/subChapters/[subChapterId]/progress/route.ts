import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string, subChapterId: string } }
) {
    try {
        const user = await currentUser()
        const { isCompleted } = await req.json()
        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_subChapterId: {
                    userId: user.id,
                    subChapterId: params.subChapterId
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId: user.id,
                subChapterId: params.subChapterId,
                isCompleted
            }
        })
        return NextResponse.json(userProgress)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}