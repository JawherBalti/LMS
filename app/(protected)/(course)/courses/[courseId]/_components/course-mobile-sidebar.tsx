import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Attachment, Chapter, Course, SubChapter, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import CourseSidebar from "./course-sidebar";

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

interface CourseMobileSidebarProps {
  course: CourseWithChaptersAndAttachments
  progressCount: number;
}

const CourseMobileSidebar = ({
  course,
  progressCount,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white dark:bg-background w-72">
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
