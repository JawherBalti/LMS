import { NavbarRoutes } from "@/components/navbar-routes";
import { Attachment, Chapter, Course, SubChapter, UserProgress } from "@prisma/client";
import CourseMobileSidebar from "./course-mobile-sidebar";

type SubChapterWithUserProgress = SubChapter & {
  userProgress: UserProgress[]
}

type ChapterWithSubChapters = Chapter & {
  subChapters: SubChapterWithUserProgress[]
}

type CourseWithChaptersAndAttachments = Course & {
  chapters: ChapterWithSubChapters[]
  attachments: Attachment[]
}

interface CourseNavbarProps {
  course: CourseWithChaptersAndAttachments
  progressCount: number;
}

const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white dark:bg-background shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};

export default CourseNavbar;
