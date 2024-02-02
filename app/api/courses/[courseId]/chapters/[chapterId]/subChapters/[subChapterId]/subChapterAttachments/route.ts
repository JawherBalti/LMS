import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string, chapterId: string, subChapterId: string } }) {
    try {
        const user = await currentUser()
        const { url } = await req.json()

        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: user.id
            }
        })

        if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 })

        const attachment = await db.chapterAttachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                subChapterId: params.subChapterId
            }
        })

        return NextResponse.json(attachment)

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}