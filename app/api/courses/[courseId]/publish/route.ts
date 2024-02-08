import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const user = await currentUser()
        const {isAdmin} = await req.json()
        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: user.id
            },
            include: {
                chapters: true
            }
        })

        if (!course) return new NextResponse("Not found", { status: 404 })

        const hasPublishedChapter = course.chapters.some(chapter => chapter.isPublished )

        if(!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter)
        return new NextResponse("Missing required fields", { status: 401 })

        const publishedCourse = isAdmin ? await db.course.update({
            where: {
                id: params.courseId,
                userId: user.id
            },
            data: {
                isPending: false,
                isPublished: true
            }
        }) :  await db.course.update({
            where: {
                id: params.courseId,
                userId: user.id
            },
            data: {
                isPending: true,
                isPublished: false
            }
        })
        return NextResponse.json(publishedCourse)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}