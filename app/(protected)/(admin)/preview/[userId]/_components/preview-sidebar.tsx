import { currentUser } from "@/lib/auth";
import { Attachment, Chapter, Course, SubChapter } from "@prisma/client";
import { redirect } from "next/navigation";
import PreviewSidebarItem from "./preview-sidebar-item";
import PreviewAttachments from "./preview-attachments";
import PreviewActions from "./preview-actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type ChapterWithSubChapters = Chapter & {
  subChapters: SubChapter[];
};

type CourseWithChaptersAndAttachments = Course & {
  chapters: ChapterWithSubChapters[];
  attachments: Attachment[];
};

interface PreviewSidebarProps {
  course: CourseWithChaptersAndAttachments;
}

const PreviewSidebar = async ({ course }: PreviewSidebarProps) => {
  const user = await currentUser();
  if (!user?.id) return redirect("/");
  if (user?.role !== "ADMIN") return redirect("/dashboard");

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-background dark:bg-background shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <Link
          href={`/admin/courses`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to courses
        </Link>
        <h1 className="font-semibold break-words">{course.title}</h1>
        <PreviewActions
          courseId={course.id}
          isPending={course.isPending}
          isPublished={course.isPublished}
        />
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <PreviewSidebarItem
            key={chapter.id}
            label={chapter.title}
            //isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            chapterId={chapter.id}
            courseId={course.id}
            subChapters={chapter.subChapters}
          />
        ))}
        <PreviewAttachments course={course} />
      </div>
    </div>
  );
};

export default PreviewSidebar;
