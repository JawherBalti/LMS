import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

const utApi = new UTApi()

export async function DELETE(req: Request, { params }: { params: { courseId: string, chapterId: string, chapterAttachmentId: string } }) {
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

        const attachment = await db.chapterAttachment.delete({
            where: {
                chapterId: params.chapterId,
                id: params.chapterAttachmentId
            }
        })

        const attachmentKey = attachment.url.split("/f/")[1]
        if (attachmentKey) {
            await utApi.deleteFiles(attachmentKey)
        }
        console.log(attachmentKey)

        return NextResponse.json(attachment)
    } catch (error) {
        return new NextResponse("Internale Error", { status: 500 })
    }

}