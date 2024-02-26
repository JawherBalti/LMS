import { NavbarRoutes } from "@/components/navbar-routes";
import { Attachment, Chapter, Course, SubChapter } from "@prisma/client";
import PreviewMobileSidebar from "./preview-mobile-sidebar";

type ChapterWithSubChapters = Chapter & {
  subChapters: SubChapter[]
}

type CourseWithChaptersAndAttachments = Course & {
  chapters: ChapterWithSubChapters[]
  attachments: Attachment[]
}

interface CourseNavbarProps {
  course: CourseWithChaptersAndAttachments
}

const PreviewNavbar = ({ course }: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white dark:bg-background shadow-sm">
      <PreviewMobileSidebar course={course} />
      <NavbarRoutes />
    </div>
  );
};

export default PreviewNavbar;
