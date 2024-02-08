import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const getUser = async (userId: string) => {
    try {
        const user = await currentUser()
        if (!user?.id) return null

        const userProfile = await db.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!userProfile) return null

        return userProfile
    } catch (error) {
        return null
    }
}