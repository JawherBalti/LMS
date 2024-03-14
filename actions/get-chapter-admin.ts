import { Chapter, ChapterAttachment, MuxData, SubChapter } from "@prisma/client"
import { db } from "../lib/db"

interface GetChapterProps {
    userId: string
    courseId: string
    chapterId: string
    subChapterId: string
}

export const getChapterAdmin = async ({
    // userId,
    courseId, 
    chapterId, 
    subChapterId
}: GetChapterProps) => {
    try {
        // const purchase = await db.purchase.findUnique({
        //     where: {
        //         userId_courseId: {
        //             userId,
        //             courseId
        //         }
        //     }
        // })

        const publishedCourse = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId
            },
            select: {
                description: true,
                price: true,
                userId: true
            }
        })

        const pendingCourse = await db.course.findUnique({
            where: {
                isPending: true,
                id: courseId
            },
            select: {
                description: true,
                price: true,
                userId: true
            }
        })

        const course = pendingCourse || publishedCourse

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            }
        })

        const subChapter = await db.subChapter.findUnique({
            where: {
                id: subChapterId,
                chapterId
            }
        })

        if (!subChapter || !chapter || !course) throw new Error("Chapter or course not found")

        const courseOwner = await db.user.findUnique({
            where: {
                id: course.userId
            },
            select: {
                id: true,
                name: true,
                image: true,
                emailVerified: true
            }
        })

        if (!courseOwner) throw new Error("Could not find course owner")

        let muxData: MuxData | null = null
        let chapterAttachments: ChapterAttachment[] = []
        let nextChapter: Chapter & { subChapters: SubChapter[] } | null = null
        let nextSubChapter: SubChapter | null = null

        chapterAttachments = await db.chapterAttachment.findMany({
            where: {
                subChapterId
            }
        })

        muxData = await db.muxData.findUnique({
            where: {
                subChapterId
            }
        })

        nextChapter = await db.chapter.findFirst({
            where: {
                courseId,
                isPublished: true,
                position: {
                    gt: chapter?.position
                }
            },
            include: {
                subChapters: true
            },
            orderBy: {
                position: "asc"
            }
        })

        nextSubChapter = await db.subChapter.findFirst({
            where: {
                chapterId,
                position: {
                    gt: subChapter?.position
                }
            },
            orderBy: {
                position: "asc"
            }
        })

        return {
            subChapter,
            chapter,
            course,
            courseOwner,
            muxData,
            chapterAttachments,
            nextChapter,
            nextSubChapter,
        }
    } catch (error) {
        return {
            subChapter: null,
            chapter: null,
            course: null,
            courseOwner: null,
            muxData: null,
            chapterAttachments: [],
            nextChapter: null,
            nextSubChapter: null,
        }
    }
}

export default getChapterAdmin