import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    try {
        const user = await currentUser()
        const { courseId } = await req.json()
        if (!user?.id) return new NextResponse("Unauthorized", { status: 401 })
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId
                }
            }
        })

        console.log(purchase);


        if (purchase) return new NextResponse("Already purchased", { status: 400 })

        const newPurchase = await db.purchase.create({
            data: {
                courseId,
                userId: user.id
            },
        })
        console.log(newPurchase);

        return NextResponse.json(newPurchase)

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}