"use client";

import { cn } from "@/lib/utils";
import { SubChapter } from "@prisma/client";
import { PlayCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface SidebarSubChapterProps {
  courseId: string;
  chapterId: string;
  subChapterId: string;
  subChapter: SubChapter;
  isCompleted: boolean;
  isSubChapterCompleted: boolean;
}
const SidebarSubChapter = ({
  courseId,
  chapterId,
  subChapterId,
  subChapter,
  isCompleted,
  isSubChapterCompleted
}: SidebarSubChapterProps) => {
  const router = useRouter();
  const params = useParams();

  const isSubChapterActive = params.subChapterId === subChapterId;

  const onClick = () => {
    router.push(
      `/courses/${courseId}/chapters/${chapterId}/subChapters/${subChapterId}`
    );
  };
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex w-full items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-200/5",
        isSubChapterActive &&
          "text-slate-700 bg-slate-200/5 hover:bg-slate-200/5 hover:text-slate-700",
        isSubChapterCompleted && " text-emerald-600 hover:text-emerald-600",
        isSubChapterCompleted && isSubChapterActive && "bg-slate-200/5"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <PlayCircle
          size={18}
          className={cn(
            "text-slate-500 dark:text-foreground",
            isSubChapterActive && "text-slate-700 dark:text-foreground",
            isSubChapterCompleted && "text-emerald-600 dark:text-emerald-600"
          )}
        />
        <span
          className={cn(
            "text-slate-500 dark:text-foreground break-words line-clamp-2 w-48 sm:w-52 md:w-60",
            isSubChapterActive && "text-slate-700 dark:text-foreground",
            isSubChapterCompleted && "text-emerald-600 dark:text-emerald-600"
          )}
        >
          {subChapter.title}
        </span>
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-14 transition-all",
          isSubChapterActive && "opacity-100",
          isSubChapterCompleted && "border-emerald-600"
        )}
      />
    </button>
  );
};

export default SidebarSubChapter;
