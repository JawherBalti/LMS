import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { commentId: string } }) {
    try {
        const user = await currentUser()
        const { replyValue } = await req.json()

        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const reply = await db.reply.create({
            data: {
                userId: user.id,
                commentId: params.commentId,
                reply: replyValue
            }
        })
        return NextResponse.json(reply)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: { commentId: string } }) {
    try {
        const user = await currentUser()

        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        // const repliesCount = await db.reply.count({
        //     where: {
        //         commentId: params.commentId
        //     }
        // })

        const replies = await db.reply.findMany({
            where: {
                commentId: params.commentId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            
        })
        return NextResponse.json({replies, repliesCount: replies.length})
    } catch (error) {
        return Response.json({ error:"Cannot get messages" }, { status: 500 });
    }
}