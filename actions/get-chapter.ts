import { Chapter, ChapterAttachment, MuxData, SubChapter } from "@prisma/client"
import { db } from "../lib/db"

interface GetChapterProps {
    userId: string
    courseId: string
    chapterId: string
    subChapterId: string

}

export const getChapter = async ({
    userId, courseId, chapterId, subChapterId
}: GetChapterProps) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        })

        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId
            },
            select: {
                description: true,
                price: true
            }
        })

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

        let muxData: MuxData | null = null
        let chapterAttachments: ChapterAttachment[] = []
        let nextChapter: Chapter | null = null
        let nextSubChapter: SubChapter | null = null

        if (purchase) {
            chapterAttachments = await db.chapterAttachment.findMany({
                where: {
                    subChapterId
                }
            })
        }

        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    subChapterId
                }
            })

            // nextChapter = await db.chapter.findFirst({
            //     where: {
            //         courseId,
            //         isPublished: true,
            //         position: {
            //             gt: chapter?.position
            //         }
            //     },
            //     orderBy: {
            //         position: "asc"
            //     }
            // })

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
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_subChapterId: {
                    userId,
                    subChapterId
                }
            }
        })

        return {
            subChapter,
            chapter,
            course,
            muxData,
            chapterAttachments,
            nextChapter,
            nextSubChapter,
            userProgress,
            purchase,
        }
    } catch (error) {
        return {
            subChapter: null,
            chapter: null,
            course: null,
            muxData: null,
            chapterAttachments: [],
            nextChapter: null,
            nextSubChapter: null,
            userProgress: null,
            purchase: null,
        }
    }
}

export default getChapter