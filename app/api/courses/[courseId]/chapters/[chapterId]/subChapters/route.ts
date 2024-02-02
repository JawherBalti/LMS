import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: {courseId: string, chapterId: string } }) {
    try {

        const { title } = await req.json()

        const user = await currentUser()
        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: user.id
            }
        })

        if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 })

        const lastSubChapter = await db.subChapter.findFirst({
            where: {
                chapterId: params.chapterId
            },
            orderBy: {
                position: "desc"
            }
        })

        const newPosition = lastSubChapter ? lastSubChapter.position + 1 : 1

        const subChapter = await db.subChapter.create({
            data: {
                title,
                chapterId: params.chapterId,
                position: newPosition
            }
        })

        return NextResponse.json(subChapter)

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }

}