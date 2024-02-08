import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utApi = new UTApi()

export async function PATCH(req: Request) {
    try {
        const user = await currentUser()
        const { isBlocked, userId } = await req.json()

        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const updatedUser = await db.user.update({
            where: {
                id: userId
            },
            data: {
                isBlocked: !isBlocked
            }
        })

        return NextResponse.json(updatedUser)

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}