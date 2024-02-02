import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import { UTApi } from 'uploadthing/server'

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
)

const utApi = new UTApi()

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
                        subChapters: {
                            include: {
                                muxData: true,
                                chapterAttachments: true
                            }
                        }
                    }
                },
            }
        })
        if (!course) return new NextResponse("Not found", { status: 404 })

        for (const chapter of course.chapters) {
            for (const subChapter of chapter.subChapters) {
                if (subChapter.videoUrl) {
                    const videoKey = subChapter.videoUrl.split("/f/")[1]
                    await utApi.deleteFiles(videoKey)
                }
                if (subChapter.muxData?.assetId) {
                    await Video.Assets.del(subChapter.muxData.assetId)
                }
                for(const attachment of subChapter.chapterAttachments) {
                    if(attachment.url) {
                        const fileKey = attachment.url.split("/f/")[1]
                        await utApi.deleteFiles(fileKey)
                    }
                }
            }
        }

        if (course.imageUrl) {
            const imageKey = course.imageUrl.split("/f/")[1] as string | string[]
            await utApi.deleteFiles(imageKey)
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