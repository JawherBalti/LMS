import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, {params}: {params: {replyId: string}}) {
    try {        
        const deletedReply = await db.reply.delete({
            where: {
                id: params.replyId
            }
        })

        return NextResponse.json(deletedReply)
    }catch(error) {
        return new NextResponse("Internal Error", {status: 500})
    }
}