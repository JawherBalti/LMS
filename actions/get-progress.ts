import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        subChapters: {
          select: {
            id: true
          }
        }
      },
    });

    const publishedSubChapters = publishedChapters.map((ch) => ch.subChapters).flat()
    const publishedSubChaptersIds = publishedSubChapters.map((ch) => ch.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        subChapterId: {
          in: publishedSubChaptersIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedSubChaptersIds.length) * 100;
    return progressPercentage;
  } catch (error) {
    return 0;
  }
};
