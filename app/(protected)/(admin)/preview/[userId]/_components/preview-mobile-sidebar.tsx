import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Attachment, Chapter, Course, SubChapter, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import PreviewSidebar from "./preview-sidebar";

type ChapterWithSubChapters = Chapter & {
  subChapters: SubChapter[]
}

type CourseWithChaptersAndAttachments = Course & {
  chapters: ChapterWithSubChapters[]
  attachments: Attachment[]
}

interface CourseMobileSidebarProps {
  course: CourseWithChaptersAndAttachments
}

const PreviewMobileSidebar = ({
  course,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white dark:bg-background w-72">
        <PreviewSidebar course={course} />
      </SheetContent>
    </Sheet>
  );
};

export default PreviewMobileSidebar;
