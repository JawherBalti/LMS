import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Attachment, Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import CourseSidebarItem from "./course-sidebar-item";
import CourseProgress from "@/components/course-progress";
import ReviewCourse from "./review-course";
import DiscussionButton from "./discussion-button";
import CourseAttachments from "./course-attachments";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
    attachments: Attachment[];
  };
  progressCount: number;
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const user = await currentUser();
  if (!user?.id) return redirect("/");

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-background dark:bg-background shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold break-words">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
        <ReviewCourse />
      </div>

      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
        <CourseAttachments purchase={purchase!} course={course} />

        <DiscussionButton courseId={course.id} />
      </div>
    </div>
  );
};

export default CourseSidebar;
