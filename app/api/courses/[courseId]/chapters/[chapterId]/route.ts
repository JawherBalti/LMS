import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node"
import { UTApi } from "uploadthing/server";

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
)

const utApi = new UTApi()

export async function DELETE(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const user = await currentUser()
        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: user.id
            }
        })

        if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 })

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            include: {
                subChapters: true
            }
        })

        const subChapters = await db.subChapter.findMany({
            where: {
                chapterId: params.chapterId
            },
            include: {
                muxData: true,
                chapterAttachments: true
            }
        })

        if (!chapter || !subChapters) return new NextResponse("Not found", { status: 404 })

        subChapters.forEach(async (subChapter) => {

            if (subChapter.videoUrl) {
                const videoKey = subChapter.videoUrl.split("/f/")
                await utApi.deleteFiles(videoKey)

                if (subChapter.muxData) {
                    await Video.Assets.del(subChapter.muxData.assetId!)
                }
            }

            subChapter.chapterAttachments.forEach(async (attachment) => {
                if (attachment.url) {
                    const fileKey = attachment.url.split("/f/")
                    await utApi.deleteFiles(fileKey)
                }
            })
        })

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        })

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        })

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deletedChapter)

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })

    }
}


export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { isPublished, ...values } = await req.json()

        const user = await currentUser()
        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: user.id
            }
        })

        if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 })

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(chapter)

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}