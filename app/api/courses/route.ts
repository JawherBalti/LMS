import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const user = await currentUser()
        const userId = user?.id

        const { title } = await req.json()

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        const course = await db.course.create({
            data: {
                userId,
                title
            }
        })
        return NextResponse.json(course)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}