import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { reportId: string } }) {
    try {
        const user = await currentUser()
        if (!user?.id || user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

        const report = await db.report.delete({
            where: {
                id: params.reportId
            }
        })

        return NextResponse.json(report)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}