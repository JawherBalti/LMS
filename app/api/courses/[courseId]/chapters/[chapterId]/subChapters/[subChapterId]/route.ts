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

export async function DELETE(req: Request, { params }: { params: { courseId: string, chapterId: string, subChapterId: string } }) {
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

        const subChapter = await db.subChapter.findUnique({
            where: {
                id: params.subChapterId,
                chapterId: params.chapterId
            },
            include: {
                chapterAttachments: true
            }
        })

        if (!subChapter) return new NextResponse("Not found", { status: 404 })

        subChapter.chapterAttachments.forEach(async (attachment) => {
            const attachmentKey = attachment.url.split("/f/")[1]
            if (attachmentKey) {
                await utApi.deleteFiles(attachmentKey)
                await db.chapterAttachment.delete({
                    where: {
                        id: attachment.id
                    }
                })
            }
        })

        if (subChapter.videoUrl) {
            const videoKey = subChapter.videoUrl.split("/f/")[1]

            await utApi.deleteFiles(videoKey)
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    subChapterId: params.subChapterId
                }
            })

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId!)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }
        }

        const deletedSubChapter = await db.subChapter.delete({
            where: {
                id: params.subChapterId
            }
        })

        return NextResponse.json(deletedSubChapter)

    } catch (error) {
        return new NextResponse("Internal Error : " + error, { status: 500 })
    }
}


export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string, subChapterId: string } }) {
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

        const oldSubChapter = await db.subChapter.findUnique({
            where: {
                id: params.subChapterId,
                chapterId: params.chapterId
            }
        })

        if (oldSubChapter?.videoUrl) {
            const videoKey = oldSubChapter.videoUrl.split("/f/")[1]
            await utApi.deleteFiles(videoKey)
        }

        const subChapter = await db.subChapter.update({
            where: {
                id: params.subChapterId,
                chapterId: params.chapterId
            },
            data: {
                ...values
            }
        })

        if (values.videoUrl) {

            const existingMuxData = await db.muxData.findFirst({
                where: {
                    subChapterId: params.subChapterId
                }
            })
            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId!)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }

            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: "public",
                test: false
            })

            await db.muxData.create({
                data: {
                    subChapterId: params.subChapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0].id
                }
            })
        }

        return NextResponse.json(subChapter)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}