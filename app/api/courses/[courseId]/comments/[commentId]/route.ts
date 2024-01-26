import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, {params}: {params: {commentId: string}}) {
    try {
        const deletedComment = await db.comment.delete({
            where:{
                id: params.commentId
            }
        })
        return NextResponse.json(deletedComment)

    }catch(error) {
        return new NextResponse("Internal Error", {status:500})
    }
}