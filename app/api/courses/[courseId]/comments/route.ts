import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const user = await currentUser()
        const { comment } = await req.json()

        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const newComment = await db.comment.create({
            data: {
                userId: user.id,
                courseId: params.courseId,
                comment
            }
        })
        return NextResponse.json(newComment)

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}