import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, {params}: {params:{courseId: string}}) {
    try {
        const user = await currentUser()
        
        const {courseId} = params
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