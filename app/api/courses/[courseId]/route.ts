import { MuxData } from '@prisma/client';
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
)

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const user = await currentUser()

        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: user.id
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })
        if (!course) return new NextResponse("Not found", { status: 404 })

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await Video.Assets.del(chapter.muxData.assetId)
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId
            }
        })

        return NextResponse.json(deletedCourse)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const user = await currentUser()

        const { courseId } = params
        const values = await req.json()

        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const course = await db.course.update({
            where: {
                id: courseId,
                userId: user.id
            },
            data: {
                ...values
            }
        })
        return NextResponse.json(course)

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}