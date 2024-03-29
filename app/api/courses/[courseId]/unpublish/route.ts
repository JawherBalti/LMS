import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const user = await currentUser()
        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: user.id
            }
        })

        if (!course) return new NextResponse("Not found", { status: 404 })

        const unpublishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId: user.id
            },
            data: {
                isPending: false,
                isPublished: false
            }
        })

        return NextResponse.json(unpublishedCourse)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}