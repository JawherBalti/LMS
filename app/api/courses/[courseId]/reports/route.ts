import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const user = await currentUser()
        const { commentId, replyId, reportReason } = await req.json()
        if (!user?.id || user.role!== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

        const report = await db.report.create({
            data: {
                courseId: params.courseId,
                reporterId: user.id,
                commentId,
                replyId,
                reportReason
            }
        })

        return NextResponse.json(report)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}